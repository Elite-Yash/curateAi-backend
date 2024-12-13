import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables
config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false, // Set to true if using port 465, otherwise false
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
