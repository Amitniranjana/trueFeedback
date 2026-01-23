import { z } from "zod";

export const verifySchema=z.object({
code:z.string().length(6 ,"code must be greater than 6 char")
})