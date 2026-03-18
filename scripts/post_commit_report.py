#!/usr/bin/env python3
"""
Git Post-Commit Report Generator
自动生成代码变更报告并发送邮件
"""

import os
import smtplib
import subprocess
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import NamedTuple


class CommitInfo(NamedTuple):
    hash: str
    message: str
    author: str
    email: str
    date: str


class DiffStats(NamedTuple):
    files_changed: int
    insertions: int
    deletions: int


def run_git_command(args: list[str]) -> str:
    """执行 git 命令并返回输出"""
    result = subprocess.run(
        ["git"] + args,
        capture_output=True,
        text=True,
        check=False
    )
    return result.stdout.strip()


def get_commit_info() -> CommitInfo:
    """获取最新提交信息"""
    commit_hash = run_git_command(["rev-parse", "HEAD"])
    message = run_git_command(["log", "-1", "--pretty=format:%s"])
    author = run_git_command(["log", "-1", "--pretty=format:%an"])
    email = run_git_command(["log", "-1", "--pretty=format:%ae"])
    date = run_git_command(["log", "-1", "--pretty=format:%ci"])
    
    return CommitInfo(
        hash=commit_hash,
        message=message,
        author=author,
        email=email,
        date=date
    )


def get_diff_stats() -> DiffStats:
    """获取变更统计"""
    stats_output = run_git_command(["diff", "--shortstat", "HEAD~1", "HEAD"])
    
    files_changed = 0
    insertions = 0
    deletions = 0
    
    if stats_output:
        parts = stats_output.split(",")
        for part in parts:
            part = part.strip()
            if "file" in part:
                files_changed = int(part.split()[0])
            elif "insertion" in part:
                insertions = int(part.split()[0])
            elif "deletion" in part:
                deletions = int(part.split()[0])
    
    return DiffStats(
        files_changed=files_changed,
        insertions=insertions,
        deletions=deletions
    )


def get_changed_files() -> list[str]:
    """获取变更文件列表"""
    output = run_git_command(["diff", "--name-only", "HEAD~1", "HEAD"])
    return output.split("\n") if output else []


def get_diff_content() -> str:
    """获取详细 diff 内容"""
    return run_git_command(["diff", "HEAD~1", "HEAD"])


def generate_report(commit: CommitInfo, stats: DiffStats, files: list[str], diff: str) -> str:
    """生成 Markdown 格式的报告"""
    report_lines = [
        "# 📊 代码变更报告",
        "",
        f"**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "---",
        "",
        "## 📝 提交信息",
        "",
        f"| 项目 | 内容 |",
        f"|------|------|",
        f"| Commit Hash | `{commit.hash[:12]}` |",
        f"| Commit Message | {commit.message} |",
        f"| Author | {commit.author} <{commit.email}> |",
        f"| Date | {commit.date} |",
        "",
        "---",
        "",
        "## 📈 变更统计",
        "",
        f"| 指标 | 数量 |",
        f"|------|------|",
        f"| 文件变更 | {stats.files_changed} |",
        f"| 新增行数 | +{stats.insertions} |",
        f"| 删除行数 | -{stats.deletions} |",
        "",
        "---",
        "",
        "## 📁 变更文件列表",
        ""
    ]
    
    if files:
        for file in files:
            if file:
                report_lines.append(f"- `{file}`")
    else:
        report_lines.append("*无文件变更*")
    
    report_lines.extend([
        "",
        "---",
        "",
        "## 🔍 详细变更内容",
        "",
        "```diff",
        diff[:5000] if len(diff) > 5000 else diff,  # 限制长度
        "```",
        ""
    ])
    
    if len(diff) > 5000:
        report_lines.append("*注: diff 内容已截断，完整内容请查看 git*")
    
    return "\n".join(report_lines)


def send_email(report: str, commit: CommitInfo) -> bool:
    """发送邮件报告"""
    smtp_email = os.environ.get("SMTP_EMAIL", "")
    smtp_auth_code = os.environ.get("SMTP_AUTH_CODE", "")
    smtp_server = os.environ.get("SMTP_SERVER", "smtp.qq.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "465"))
    
    if not smtp_email or not smtp_auth_code:
        print("⚠️  SMTP 配置缺失，请设置环境变量:")
        print("   export SMTP_EMAIL='your_email@qq.com'")
        print("   export SMTP_AUTH_CODE='your_auth_code'")
        return False
    
    recipient = run_git_command(["config", "user.email"])
    if not recipient:
        print("⚠️  无法获取 git user.email")
        return False
    
    try:
        msg = MIMEMultipart()
        msg["From"] = formataddr(["Qoder Code Report", smtp_email])
        msg["To"] = recipient
        msg["Subject"] = f"[Code Report] {commit.hash[:7]} - {commit.message[:50]}"
        msg.attach(MIMEText(report, "markdown", "utf-8"))
        
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_email, smtp_auth_code)
            server.sendmail(smtp_email, recipient, msg.as_string())
        
        print(f"✅ 报告已发送至: {recipient}")
        return True
    except Exception as e:
        print(f"❌ 邮件发送失败: {e}")
        return False


def main():
    """主函数"""
    print("🚀 生成代码变更报告...")
    
    # 获取提交信息
    commit = get_commit_info()
    print(f"   提交: {commit.hash[:7]} - {commit.message[:30]}...")
    
    # 获取变更统计
    stats = get_diff_stats()
    print(f"   变更: {stats.files_changed} 文件, +{stats.insertions}/-{stats.deletions}")
    
    # 获取文件列表和 diff
    files = get_changed_files()
    diff = get_diff_content()
    
    # 生成报告
    report = generate_report(commit, stats, files, diff)
    
    # 发送邮件
    if send_email(report, commit):
        print("✅ 完成!")
    else:
        # 发送失败时输出报告
        print("\n" + "="*50)
        print("📄 报告内容:")
        print("="*50)
        print(report)


if __name__ == "__main__":
    main()
