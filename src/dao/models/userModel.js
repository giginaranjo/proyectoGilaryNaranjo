import mongoose from "mongoose";

export const usersModel = mongoose.model(
    "users", new mongoose.Schema(
        {
            name: {
                type: String, require: true
            },
            email: {
                type: String, unique: true, require: true
            },
            password: {
                type: String, require: true
            },
            rol: {
                type: String, default: "User"
            }
        }
    ))