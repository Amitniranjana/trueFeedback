import * as React from 'react';

interface EmailTemplateProps {
  firstName: string,
  otp: string,

}

export function EmailTemplate({ firstName  ,otp }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <p>Your verification code is: <strong>{otp}</strong></p>
      <p>This code will expire in 1 hour.</p>
      <p>Thank you for joining us!</p>
    </div>
  );
}