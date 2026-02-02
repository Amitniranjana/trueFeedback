
import * as React from 'react';
import { EmailTemplate } from "../emails/verificationEmail";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationMail(
  userEmail: string,
  firstName: string,
  verifyCode: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <yamitniranjan@gmail.com>',
      to: [userEmail],
      subject: 'Email Verification',
      react: React.createElement(EmailTemplate, { firstName, otp: verifyCode }),
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}