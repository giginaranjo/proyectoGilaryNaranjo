import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String, require: true
        },
        last_name: String,
        email: {
            type: String, unique: true, require: true
        },
        age: Number,
        password: {
            type: String, require: true
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts"
        },
        role: {
            type: String, default: "USER"
        }
    },
    {
        strict: false
    }
)


userSchema.pre("findOne", function () {
    this.populate("cart").lean()
})


export const usersModel = mongoose.model(
    "users", userSchema
)