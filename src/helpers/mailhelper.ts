import { transporter } from '../config/mailer.config';
import { config } from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';

config();

interface SendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const appUrl = process.env.APP_URL;
if (!appUrl) {
    throw new Error('APP_URL is not defined in the environment variables');
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'Curate AI', // Default from address
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Failed to send email');
    }
};

const loadTemplate = async (templateName: string): Promise<Handlebars.TemplateDelegate> => {
    try {
        const templatePath = path.join(__dirname, '..', 'email-templates', `${templateName}.html`);
        const templateSource = await fs.readFile(templatePath, 'utf-8');
        return Handlebars.compile(templateSource);
    } catch (error) {
        console.error(`Error loading email template (${templateName}):`, error);
        throw new Error('Failed to load email template');
    }
};

export const sendForgotPasswordEmail = async (email: string, resetToken: string): Promise<void> => {
    try {
        const template = await loadTemplate('forgot-password');
        const context = {
            forgotPasswordUrl: `${appUrl}/dummyurl?token=${resetToken}`,
        };
        const htmlContent = template(context);

        await sendEmail({
            to: email,
            subject: 'Reset Your Password',
            text: `We received a request to reset your password. You can reset your password by clicking the following link: ${context.forgotPasswordUrl}`,
            html: htmlContent,
        });
    } catch (error) {
        console.error('Failed to send forgot password email:', error);
        throw error;
    }
};
