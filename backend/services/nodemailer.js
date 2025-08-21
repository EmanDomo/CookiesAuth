import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EmailService = {
    async sendEmail(to, subject, text) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            await transporter.sendMail({
                from: `"Your App" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                text
            });

            console.log(`✅ Email sent to ${to}`);
        } catch (err) {
            console.error(`❌ Failed to send email to ${to}:`, err.message);
            throw err;
        }
    }
};

export default EmailService;
