import { NextRequest } from "next/server";
import { EmailTemplate } from "../emails/verificationEmail";
import { Resend } from 'resend';



const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:NextRequest) {
  try {
    const body= await request.json();
    const {email}=body;
    if(!email){
        return Response.json({
            success:false,
            message:"email is required to send the mail"
        })
    }
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to:[email],
      subject: 'true feedback || verification code ',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}