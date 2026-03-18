# Post Commit Report 配置

## 永久配置

将环境变量添加到 `~/.zshrc` 永久生效：

```bash
echo 'export SMTP_EMAIL="810768333@qq.com"' >> ~/.zshrc
echo 'export SMTP_AUTH_CODE="uuugvboaowzbbebc"' >> ~/.zshrc
source ~/.zshrc
```

## QQ 邮箱授权码获取

设置 → 账户 → POP3/SMTP服务 → 生成授权码

## 相关文件

| 文件 | 说明 |
|------|------|
| `.husky/post-commit` | Git hook，commit 后自动触发 |
| `scripts/post_commit_report.py` | Python 报告生成脚本 |

## Python 邮件发送模板

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
import subprocess

def send_report_email(report_content: str, commit_hash: str, commit_msg: str):
    """发送代码变更报告邮件"""
    smtp_server = "smtp.qq.com"
    smtp_port = 465
    sender_email = "your_email@qq.com"
    sender_auth_code = "your_auth_code"
    
    recipient = subprocess.check_output(["git", "config", "user.email"]).decode().strip()
    
    msg = MIMEMultipart()
    msg["From"] = formataddr(["Qoder Code Report", sender_email])
    msg["To"] = recipient
    msg["Subject"] = f"[Code Report] {commit_hash[:7]} - {commit_msg[:50]}"
    msg.attach(MIMEText(report_content, "markdown", "utf-8"))
    
    with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
        server.login(sender_email, sender_auth_code)
        server.sendmail(sender_email, recipient, msg.as_string())
    
    print(f"报告已发送至: {recipient}")
```
