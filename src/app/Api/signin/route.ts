import { NextRequest, NextResponse } from "next/server";
import UserModel from '@/app/models/user';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Fix 1: Correct import
import connect from "@/app/lib/dbConnect";

export async function POST(request: NextRequest) { // Fix 2: Named export 'POST' (uppercase)
    try {
        await connect(); // Fix 3: Connect to DB before querying

        const reqBody = await request.json();
        // Fix 4: Destructure directly unless your frontend specifically nests data inside "data"
        const { email, password } = reqBody;


        // FIX: Validate input exists before proceeding
        if (!email || !password) {
            return NextResponse.json({
                status: false,
                message: "Email and password are required"
            }, { status: 400 });
        }
        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({
                status: false,
                message: "User with this email is not found"
            }, { status: 400 }); // Add status code
        }

        // FIX: Handle edge case where user exists but has no password (e.g. Google Auth user)
        if (!user.password) {
            return NextResponse.json({
                status: false,
                message: "Invalid login method"
            }, { status: 400 });
        }
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return NextResponse.json({
                status: false,
                message: "Password is incorrect"
            }, { status: 400 });
        }

        // Fix 5: Security - Removed password from token payload
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // Fix 6: Ensure SECRET_KEY is treated as a string
        const token = jwt.sign(tokenData, process.env.SECRET_KEY!, { expiresIn: "1d" });

        const response = NextResponse.json({
            status: true,
            message: "Signin successful"
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/" // Good practice to ensure cookie is available everywhere
        });

        return response;

    } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.log(errMsg);
        return NextResponse.json({
            status: false,
            message: errMsg
        })
    }

}