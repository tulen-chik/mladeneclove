import nodemailer, { Transporter } from 'nodemailer';

class MailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            port: Number(process.env.SMTP_PORT),
            host: process.env.SMTP_HOST,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_USER_PASS,
            },
        });
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на сайте writheinfi',
            text: '',
            html: `<div><h1>для активации перейдите по ссылке</h1><a href="${link}">нажать</a></div>`,
        });
    }
}

export default new MailService();
