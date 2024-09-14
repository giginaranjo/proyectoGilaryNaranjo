import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

export const productSchema = new mongoose.Schema(
    {
        title: {
            type: String, unique: true, require: true
        },
        description: {
            type: String, require: true
        },
        code: {
            type: String, unique: true, require: true
        },
        price: {
            type: Number, require: true
        },
        status: {
            type: Boolean, default: true
        },
        stock: {
            type: Number, require: true
        },
        category: {
            type: String, require: true
        },
        thumbnail: []
    },
    {
        timestamps: true
    }
)

productSchema.plugin(paginate)

export const productsModel = mongoose.model(
    "products", productSchema)