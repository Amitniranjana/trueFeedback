import UserModel from "@/app/models/user";
import { apiresponse } from "@/app/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<apiresponse> {
    const data = request.json();
    const { email, username, password } = data;
    const isUserAlreadyExistVerified = await UserModel.findOne({ username, isVerified: true });
    if (isUserAlreadyExistVerified) {
        return Response.json({
            success: false,
            message: "user already exist"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            verifyCode: token,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: false,
            message: []
        });
        newUser.save();
        
       return Response.json({
            success: true,
            message: "user saved successfully"
        })
    }else{

    }
}