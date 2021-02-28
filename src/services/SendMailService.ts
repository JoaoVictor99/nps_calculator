import nodemailer, { Transport, Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import { User } from '../models/User';

class SendMailService {
    private client: Transporter
    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }
    async execute(to: string, subject: string, variables: object, path: string) {

        const templateFileContent = fs.readFileSync(path).toString("utf8");

        const mainTemplateParse = handlebars.compile(templateFileContent);



        const html = mainTemplateParse(variables);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>"
        })


        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();