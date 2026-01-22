import mongoose, { Schema, Document } from "mongoose";

export interface Messages extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema:Schema<Messages>= new Schema({
content:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
}
})
// 1. Interface (TypeScript ke liye structure)
// Isme wahi fields honi chahiye jo Schema mein hain
export interface User extends Document {
  username: string;
  email: string;
  password?: string; // ? isliye lagaya agar Google Auth use karoge to password null ho sakta hai
  createdAt: Date;
  verifyCode:string,
  verifyCodeExpiry:Date,
  isVerified:boolean,
  isAcceptingMessage:boolean,
  message:Messages[]
}

// 2. Schema (Database validation ke liye)
const UserSchema:Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+\@.+\..+/, "Please fill a valid email address"], // Regex check
  },
  password: {
    type: String,
     required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifyCode:{
    type:String,
required:[true ,"verify code is required"]

  }
  , verifyCodeExpiry:{
    type:Date,
    required:[true ,"verify code expiry is required"]
  },
   isVerified:{
    type:Boolean,
    default:false

  }
  ,isAcceptingMessage:{
    type:Boolean,
 default:false
  },
 message:[MessageSchema]
});

// 3. Model Export (Next.js Edge Case Handling)
// Next.js mein hot-reload ki wajah se model baar-baar compile hota hai,
// isliye hum check karte hain ki 'mongoose.models.User' pehle se bana hai ya nahi.
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;