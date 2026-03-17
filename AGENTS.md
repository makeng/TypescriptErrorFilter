## Code Style

- 严格化：确保所有业务 ID（如 `OrderId`）**尽量**使用 `Branding` 模式
- 清晰化：不实用 I 开头（如 IColor，直接 Color 即可）
- 变量名清晰：不实用 type、new 等关键标识作为前缀或后缀

## Skills

### /post-commit-report

提交后自动生成代码变更对比报告并发送邮件。

**触发条件**: 用户执行 `/post-commit-report` 命令

**执行步骤**:

1. **获取提交信息**
   - 运行 `git log -1 --pretty=format:"%H %s"` 获取最新提交的 hash 和 message
   - 运行 `git config user.email` 获取用户邮箱

2. **生成代码对比报告**
   - 运行 `git diff HEAD~1 HEAD` 获取本次提交的代码变更
   - 分析变更内容，生成结构化报告，包含：
     - 提交信息 (hash, message, author, date)
     - 变更文件列表
     - 新增/删除/修改的代码行数统计
     - 主要变更内容摘要

3. **发送邮件报告**
   - 使用 Python 的 smtplib 发送邮件
   - 邮件标题: `[Code Report] {commit_hash[:7]} - {commit_message}`
   - 邮件正文: Markdown 格式的变更报告
   - 收件人: git config 中的 user.email

**Python 邮件发送模板**:
```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
import subprocess
import datetime

def send_report_email(report_content: str, commit_hash: str, commit_msg: str):
    """发送代码变更报告邮件"""
    # 配置 SMTP (示例使用 QQ 邮箱，用户需自行配置授权码)
    smtp_server = "smtp.qq.com"
    smtp_port = 465
    sender_email = "your_email@qq.com"  # 发件人邮箱
    sender_auth_code = "your_auth_code"  # SMTP 授权码
    
    # 获取收件人
    recipient = subprocess.check_output(["git", "config", "user.email"]).decode().strip()
    
    # 构建邮件
    msg = MIMEMultipart()
    msg["From"] = formataddr(["Qoder Code Report", sender_email])
    msg["To"] = recipient
    msg["Subject"] = f"[Code Report] {commit_hash[:7]} - {commit_msg[:50]}"
    msg.attach(MIMEText(report_content, "markdown", "utf-8"))
    
    # 发送邮件
    with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
        server.login(sender_email, sender_auth_code)
        server.sendmail(sender_email, recipient, msg.as_string())
    
    print(f"报告已发送至: {recipient}")
```

**注意事项**:
- 用户需要自行配置 SMTP 发件人邮箱和授权码
- 建议使用环境变量存储敏感信息 (如 `SMTP_EMAIL`, `SMTP_AUTH_CODE`)
- 如果邮件发送失败，应在终端输出报告内容作为备选
