import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products"
                    },
                    quantity: {
                        type: Number,
                        min: 1
                    }
                }
            ]
        }
    }
)

cartSchema.pre("find", function() {
    this.populate("products.product").lean()
})  

cartSchema.pre("findOne", function() {
    this.populate("products.product").lean()
})


export const cartsModel = mongoose.model(
    "carts", cartSchema
)