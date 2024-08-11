import fs from "fs";

export class ProductManager {

    static path

    static async getProducts() {
        if (fs.existsSync(this.path)) {
            let products = JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }))
            return products
        }else{
            return []
        }
    }

    static async addProduct(){
        let products = await this.getProducts()

        let id = (products.length > 0) ? this.products[this.products.length-1]+1 : 1;
        
        let newProduct = {
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
        products.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return newProduct
    }

    static async modifyProduct(id, modification={}){
        let products = await this.getProducts()
        let indexProduct = products.findIndex(p => p.id === id)
        if(indexProduct ===-1){
            throw new Error(`Id ${id} not found`)
        }

        products[indexProduct]={
            ...products[indexProduct],
            ...modification,
            id
        }

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return products[indexProduct]
    }

    static async deleteProduct(id){
        let productsBefore = await this.getProducts()
        let productsAfter = productsBefore.filter(p => p.id != id)

        if(productsBefore.length === productsAfter){
            throw new Error(`Product not found`)
        }

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        return productsAfter

    }
}
