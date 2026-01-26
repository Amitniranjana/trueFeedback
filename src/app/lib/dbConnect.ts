import mongoose from "mongoose";
export default async function connect() {
        // Check karein agar pehle se connected hai (State = 1)
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB.");
        return;
    }

    // Agar connecting state mein hai (State = 2), toh wait karein
    if (mongoose.connection.readyState === 2) {
        console.log("Connecting... please wait.");
        return;
    }
        try {
                await mongoose.connect(process.env.MONGO_URI!);
                const connection = mongoose.connection;
                connection.on("connect", () => {
                        console.log("mongodb connected successfully");
                })
                console.log("error in connect to mongodb")

        }catch (err: any) {
        console.log("mongodb connection error", err.message);
        process.exit(1);
    }
}