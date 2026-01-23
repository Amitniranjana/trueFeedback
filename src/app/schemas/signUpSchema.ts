import * as z from "zod";
export const signUpSchema=z.object({
    email:z.email(),
    password:z.string().min(8,"password must be 8 char"),
    username:z.string().min(4 , "username must be grater than 4 char").max(15 ,"username must be less than 15 char")
})