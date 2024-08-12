import fs from "fs";
import path from "path";
import ProductsManager from "./productManager.js";

const dbCarts = path.resolve("./src/data/carts.json");

export default class CartsManager {

    static async getCarts() {
        if (fs.existsSync(dbCarts)) {
            let carts = JSON.parse(await fs.promises.readFile(dbCarts, { encoding: "utf-8" }))
            return carts
        } else {
            return []
        }
    }

    static async createCart(newCart) {

        let carts = await this.getCarts()
        let id = (carts.length > 0) ? carts[carts.length - 1].id + 1 : 100;

        let {product} = newCart

        let cartCreated = {
            id,
            product
        }
        carts.push(cartCreated)

        await fs.promises.writeFile(dbCarts, JSON.stringify(carts, null, 5))
        return cartCreated
    }

    static async addProduct(idCard, idProduct) {
        let carts = await this.getCarts()
        let cart = carts.find(c => c.id === idCard)

        if(!cart){
            return { success: false, message: 'Cart not found' };
        }

        let products = await ProductsManager.getProducts()
        let product = products.find(p => p.id === parseInt(idProduct));
        if (!product) {
            return { success: false, message: 'Product not found' };
        }

        let addProduct = cart.product.find(p => p.id === idProduct)


        if (!addProduct) {
            cart.product.push({id: idProduct, quantity: 1})
        } else {
            addProduct.quantity += 1
        }

        console.log(addProduct);
        

        await fs.promises.writeFile(dbCarts, JSON.stringify(carts, null, 5))
        return cart
    } 

}
