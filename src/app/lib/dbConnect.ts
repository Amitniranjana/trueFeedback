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

        }catch (err: unknown) {
            // Aapka Jawaab: "Sir, agar main "any" use karta, toh TypeScript saare checks disable kar deta. Agar galti se err me .message property nahi hoti (jaise agar error null hota), toh runtime pe Cannot read property 'message' of null aa jata aur application crash ho sakti thi. unknown mujhe force karta hai ki main pehle type check karu, jo production code ke liye best practice hai."
            const errMsg = err instanceof Error ? err.message :String(err);
        console.log("mongodb connection error", errMsg);
        process.exit(1);
    }
}