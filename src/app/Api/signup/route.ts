import UserModel from "@/app/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/dbConnect";
import { sendVerificationMail } from "@/app/lib/resend";

export async function POST(request: NextRequest) {
  // 1. FIX: Await the database connection
  await connect();

  try {
    const data = await request.json();
    const { email, username, password } = data;

    // Check if a verified user already exists by username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existingUserByEmail) {
      // 2. FIX: LOGIC for Existing User
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        // Update the EXISTING user (Do not create a new one)
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = token;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        // 3. FIX: Await the save
        await existingUserByEmail.save();
      }
    } else {
      // 4. FIX: Create NEW user only if email does not exist
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        verifyCode: token,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: false,
        message: [],
      });

      // 3. FIX: Await the save
      await newUser.save();
    }
    const emailResponse= await sendVerificationMail(email , username , token);
    if(!emailResponse.success){
      console.error("in a trouble to send message")
      return NextResponse.json({
        success:false,
        data:emailResponse,
      })
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Signup Error:", errMsg);

    // 5. FIX: Return a response if error occurs
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}