import mongoose from "mongoose";


export const productsModel = mongoose.model(
    "products", 
    new mongoose.Schema(
        {
                title: {
                    type: String, unique: true
                },
                description: String,
                code: {
                    type: String, unique: true
                }, 
                price: Number,
                status: {
                    type: Boolean, default:true},
                stock: Number,
                category: String,
                thumbnail: []
        }
    )
)