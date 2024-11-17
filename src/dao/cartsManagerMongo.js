import { cartsModel } from "./models/cartsModel.js";


export class CartsManagerMongo {

    // Obtener carritos
    static async getCarts() {
        return await cartsModel.find().lean()
    }

    // Obtener carrito por id
    static async getBy(id) {
        return await cartsModel.findOne({ _id: id }).lean()
    }

    // Crear carrito
    static async createCart() {
        let createdCart = await cartsModel.create({ products: [] })
        return createdCart.toJSON()
    }

    // Añadir productos a carrito
    static async addProduct(id, cart) {
        return cartsModel.updateOne({ _id: id }, cart)
    }

    // Modificar productos del carrito
    static async modifyCart(id, modification) {
        return await cartsModel.findByIdAndUpdate(id, modification, { new: true }).lean()
    }

    // Modificar cantidad de productos del carrito
    static async updateCart(cartId, productId, quantity) {
        return await cartsModel.findOneAndUpdate(
            { _id: cartId, "products.product": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true, upsert: true }).lean()
    }

    //Eliminar producto de carrito (individual)
    static async deleteProductCart(cartId, productId) {
        return await cartsModel.findByIdAndUpdate(
            cartId,
            { $pull: { products: { product: productId } } },
            { new: true }).lean()
    }

    // Vaciar carrito 
    static async emptyCart(id) {
        return await cartsModel.findByIdAndUpdate(
            id,
            { $set: { products: [] } },
            { new: true }).lean()
    }
}