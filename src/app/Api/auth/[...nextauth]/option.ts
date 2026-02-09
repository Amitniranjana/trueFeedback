import  { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import UserModel from "@/app/models/user"
import bcrypt from "bcryptjs"
import connect from '@/app/lib/dbConnect';


export const nextOptions:NextAuthOptions={

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                //connect database
                await connect();
                try {
                    // 2. Check if credentials exist
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Missing email or password");
                    }
                    const user = await UserModel.findOne({ email: credentials?.email });
                    if (!user) {
                        throw new Error("provided email is wrong");
                        // Return null if user data could not be retrieved
                        return null
                    }
                    const hashedPassword = await bcrypt.hash(credentials?.password, 10);

                    const isPasswordCorrect = await bcrypt.compare(credentials?.password, hashedPassword);
                    if (!isPasswordCorrect) {
                        throw new Error("password is incorrect")
                        // Return null if user data could not be retrieved
                        return null
                    }
                    return user;
                    // If no error and we have user data, return it

                    return user;

                } catch (err: unknown) {
                    const errMsg = err instanceof Error ? err.message : String(err);
                    console.log(errMsg);

                }
            }
        })
    ],
    pages: {
        signIn: "sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret:process.env?.NEXTAUTH_SECRET

}