import * as z from "zod";

export const messageSchema=z.object({
    content:z.string().min(5 ,"content must be grester than 5 char"),
    createAt:z.iso.date()
})