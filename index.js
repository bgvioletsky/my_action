const nodemailer = require('nodemailer');
const core = require('@actions/core');

async function sendMail() {
    try {
        // 获取用户在工作流中配置的输入参数
        const serverAddress = core.getInput('server_address');
        const serverPort = parseInt(core.getInput('server_port'));
        const username = core.getInput('username');
        const password = core.getInput('password');
        const subject = core.getInput('subject');
        const body = core.getInput('body');
        const to = core.getInput('to');
        const from = core.getInput('from');
        const isHtml = core.getInput('html') === 'true';

        // 创建 SMTP 传输对象
        const transporter = nodemailer.createTransport({
            host: serverAddress,
            port: serverPort,
            secure: serverPort === 465, // 如果端口是 465，使用 SSL
            auth: {
                user: username,
                pass: password
            }
        });

        // 构建邮件选项
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            [isHtml ? 'html' : 'text']: body
        };

        // 发送邮件
        const info = await transporter.sendMail(mailOptions);
        core.info(`Email sent: ${info.messageId}`);
    } catch (error) {
        // 若发送邮件过程中出现错误，将错误信息反馈给 GitHub Actions
        core.setFailed(`Error sending email: ${error.message}`);
    }
}

// 调用发送邮件函数
sendMail();
