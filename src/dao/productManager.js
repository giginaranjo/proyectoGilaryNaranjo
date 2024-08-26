import fs from "fs";
import path from "path";

const dbProducts = path.resolve("./src/data/products.json");


export default class ProductsManager {

    // Obtener productos

    static async getProducts() {
        if (fs.existsSync(dbProducts)) {
            let products = JSON.parse(await fs.promises.readFile(dbProducts, { encoding: "utf-8" }))
            return products
        } else {
            return []
        }
    }

    // Añadir productos

    static async addProduct(newProduct) {
        let products = await this.getProducts()

        let id = (products.length > 0) ? products[products.length - 1].id + 1 : 1;
        let status = true;

        let {title, description, code, price, stock, category, thumbnail} = newProduct

        price = parseFloat(price)
        stock = parseInt(stock)

        let addedProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail
        }

        products.push(addedProduct)

        await fs.promises.writeFile(dbProducts, JSON.stringify(products, null, 5))
        return addedProduct
    }

    // Modificar productos

    static async modifyProduct(id, modification = {}) {
        let products = await this.getProducts()
        let indexProduct = products.findIndex(p => p.id == id)

        if (indexProduct === -1) {
            return { success: false, message: 'Product not found' };
        }

        products[indexProduct] = {
            id,
            ...products[indexProduct],
            ...Object.fromEntries(Object.entries(modification).filter(([key, value]) => value !== '' && value !== undefined && value !== null && key !== "pid" && (!Array.isArray(value) || value.length > 0 )))
        }

        await fs.promises.writeFile(dbProducts, JSON.stringify(products, null, 5))
        return products[indexProduct]
    }

    // Eliminar productos

    static async deleteProduct(id) {
        let products = await this.getProducts()
        let productsAfter = products.filter(p => p.id != id)


        if (products.length === productsAfter.length) {
            return { success: false, message: 'Product not found' };
        }

        await fs.promises.writeFile(dbProducts, JSON.stringify(productsAfter, null, 5))
        return productsAfter

    }
}