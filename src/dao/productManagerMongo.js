import { productsModel } from "./models/productModel.js"

export class ProductsManagerMongo {

    // Obtener productos

    static async get() {
        return await productsModel.find().lean()
    }

    static async getProducts(filter= {}, page, limit, sort={}) {
       return await productsModel.paginate(filter, {lean:true, page, limit, sort})
    }

    // Obtener productos por id

    static async getProductsBy(filter={}) {
        return await productsModel.findOne(filter).lean()
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