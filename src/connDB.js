import mongoose from "mongoose";
import { config } from "./config/config.js";

export const connDB = async () => {
    try {
        await mongoose.connect(
            config.URL_MONGO, 
            {dbName: config.DB_NAME}
        )
        console.log("DB connected");
        
    } catch (error) {
        console.log(`Error connecting to DB: ${error.message}`);
    }
}