## Code Style

- 严格化：确保所有业务 ID（如 `OrderId`）**尽量**使用 `Branding` 模式
- 清晰化：不实用 I 开头（如 IColor，直接 Color 即可）
- 变量名清晰：不实用 type、new 等关键标识作为前缀或后缀

## Skills

### /`post-commit-report`

提交后自动生成代码变更对比报告并发送邮件。

**触发条件**: 用户执行 `/post-commit-report` 命令

**执行步骤**:

1. **获取提交信息**
   - 运行 `git log -1 --pretty=format:"%H %s"` 获取最新提交的 hash 和 message
   - 运行 `git config user.email` 获取用户邮箱

2. **生成代码对比报告**
   - 运行 `git diff HEAD~1 HEAD` 获取本次提交的代码变更
   - 分析变更内容，生成结构化报告

3. **发送邮件报告**
   - 使用 Python smtplib 发送邮件
   - 收件人: git config 中的 user.email

**配置说明**: 详见 [`.qoder/mail/config.md`](.qoder/mail/config.md)
