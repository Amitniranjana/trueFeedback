import { Messages } from "@/app/models/user"
export interface apiresponse{
    success:boolean,
    message:string,
    isAcceptingMessage:boolean,
    messages?:Array<Messages>
}