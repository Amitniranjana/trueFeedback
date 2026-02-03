import { NextRequest, NextResponse } from "next/server";
import UserModel from '@/app/models/user';
import bcrypt from "bcryptjs";
import { jwt } from "jsonwebtoken";


export default async function POSt(request: NextRequest) {
    const { data } = await request.json();
    const { email, password, username } = data;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return NextResponse.json({
            status: false,
            message: "user with this email is not found"
        })
    }

    const checkPassword= await bcrypt.compare( password ,user.password );
    if(!checkPassword){
          return NextResponse.json({
            status: false,
            message: "password is incorrect"
        })
    }

    if(checkPassword){
        const tokenData={
            id:user._id,
            password:user.username,
            email:user.email
        }
        const token=jwt.sign(tokenData , process.env.SECRET_KEY);
        
    }

}