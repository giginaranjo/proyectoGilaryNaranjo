import { cartsModel } from "./models/cartsModel.js";
/* import ProductsManager from "./productManager.js"; */

export class CartsManagerMongo {

    // Obtener carritos

    static async getCarts() {
        return await cartsModel.find().lean()
    }

    // Obtener carrito por id

    static async getCartsBy(id) {
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
}