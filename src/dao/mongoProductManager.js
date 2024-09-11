import { productsModel } from "./models/productModel.js"

export class MongoProductsManager {

    // Obtener productos

    static async getProducts() {
       return await productsModel.find().lean()
    }

    // Añadir productos

    static async addProduct(newProduct) {
        let addedProduct = await productsModel.create(newProduct)
        return addedProduct.toJSON()
    }

    // Modificar productos

    static async modifyProduct(id, modification = {}) {
        return await productsModel.findByIdAndUpdate(id, modification, {new: true}).lean()
    }

    // Eliminar productos

    static async deleteProduct(id) {  
        return await productsModel.findByIdAndDelete(id).lean()
    }
}