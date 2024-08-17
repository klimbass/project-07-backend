import jwt from 'jsonwebtoken';
import { env } from './env.js';
import path from 'node:path';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import { sendEmail } from './sendMail.js';
import createHttpError from 'http-errors';

const sendVerifyEmail = async (user) => {
  const verifyToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '2m',
    },
  );

  const verifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
  const name = user.name !== 'User' ? user.name : user.email.split('@')[0];
  const templateSource = await fs.readFile(verifyEmailTemplatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: name,
    verification_link: `${env('LINK_VERIFY_EMAIL')}?verifyToken=${verifyToken}`,
    email_support: `${env('EMAIL_SUPPORT')}`,
  });

  try {
    const emailResult = await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: user.email,
      subject: 'Verify your email',
      html,
      attachments: [
        {
          filename: 'AquaTrack.png',
          path: path.resolve('src', 'logo/AquaTrack.png'),
          cid: 'logo',
        },
      ],
    });

    console.log(`Email sent: ${emailResult}`);
    return emailResult;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw createHttpError(500, 'Error sending verification email');
  }
};

export default sendVerifyEmail;
