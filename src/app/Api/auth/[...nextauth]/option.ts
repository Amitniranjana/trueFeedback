import  { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import UserModel from "@/app/models/user"
import bcrypt from "bcryptjs"
import connect from '@/app/lib/dbConnect';
import { User } from '../../../models/user';


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

                    const isPasswordCorrect = await bcrypt.compare(user.password, hashedPassword);
                    if (!isPasswordCorrect) {
                        throw new Error("password is incorrect")
                        // Return null if user data could not be retrieved
                        return null
                    }

                    return {
                        id:user?._id.toString(),
                        email:user?.email
                    };

                } catch (err: unknown) {
                    const errMsg = err instanceof Error ? err.message : String(err);
                    console.log(errMsg);
                    return null

                }
            }
        })
    ],
    callbacks:{
         async jwt({ token, user }) {
        if(user){
            token.email=user.email;
            token.id=user.id;
        }
      return token

    },
async session({ session, token }) {
    if(token){
session.user.email=token.email;
session.user.id=token.id ;
    }

      return session
    },
},

    pages: {
        signIn: "sign-in"
    },

    session: {
        strategy: "jwt"
    },
    secret:process.env?.NEXTAUTH_SECRET

}
