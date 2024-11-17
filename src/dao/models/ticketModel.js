import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true},
        purchase_datetime: String,
        amount: Number,
        purchaser: String
    },
    {
        strict: false
    }
)

export const ticketModel = mongoose.model(
    "tickets", ticketSchema
)