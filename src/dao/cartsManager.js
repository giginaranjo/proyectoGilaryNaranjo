import fs from "fs";
import path from "path";
import { config } from "../config/config.js";
import { productsService } from "../repository/ProductsService.js";

const dbCarts = path.resolve(config.CARTS_PATH);

export default class CartsManager {

    // Obtener carrito

    static async getCarts() {
        if (fs.existsSync(dbCarts)) {
            let carts = JSON.parse(await fs.promises.readFile(dbCarts, { encoding: "utf-8" }))
            return carts
        } else {
            return []
        }
    }

    // Crear carrito

    static async createCart(newCart) {

        let carts = await this.getCarts()
        let id = (carts.length > 0) ? carts[carts.length - 1].id + 1 : 100;

        let { products } = newCart

        let cartCreated = {
            id,
            products
        }
        carts.push(cartCreated)

        await fs.promises.writeFile(dbCarts, JSON.stringify(carts, null, 5))
        return cartCreated
    }

    // Añadir productos a carrito

    static async addProduct(idCard, idProduct) {
        let carts = await this.getCarts()
        let cart = carts.find(c => c.id === idCard)

        if (!cart) {
            return { success: false, message: 'Cart not found' };
        }

        let productsColl = await productsService.getProducts()
        let products = productsColl.find(p => p.id === parseInt(idProduct));
        if (!products) {
            return { success: false, message: 'Product not found' };
        }

        let addProduct = cart.products.find(p => p.id === idProduct)


        if (!addProduct) {
            cart.products.push({ id: idProduct, quantity: 1 })
        } else {
            addProduct.quantity += 1
        }

        await fs.promises.writeFile(dbCarts, JSON.stringify(carts, null, 5))
        return cart
    }
}