// import ProductsManager from "./dao/productManager.js";
import { ProductsManagerMongo as DAO } from "../dao/productManagerMongo.js"
import { ProductsDTO } from "../dto/ProductsDTO.js"


class ProductsService{
    constructor(dao){
        this.productsDAO = dao
    }

    async getProducts(){
        let products = await this.productsDAO.get()

        if (Array.isArray(products)) {
            products = products.map(p => new ProductsDTO(p))
        } else {
            products = new ProductsDTO(products)
        }

        return products
    }

    async getProductsPaginate(filter = {}, page, limit, sort = {}){
        let products = await this.productsDAO.getProducts(filter, page, limit, sort)

        if (Array.isArray(products.docs)) {
            products.docs = products.docs.map(p => new ProductsDTO(p))
        }

        return products
    }

    async getProductsBy(filter){
        let product = new ProductsDTO(await this.productsDAO.getProductsBy(filter))    
        return product
    }

    async getProductsById(id){
        let product = new ProductsDTO(await this.productsDAO.getProductsBy(id))  
        return product
    }

    async addProduct(newProduct){
        return await this.productsDAO.addProduct(newProduct)
    }

    async modifyProduct(id, modification = {}){
        return await this.productsDAO.modifyProduct(id, modification)
    }

    async deleteProduct(id){
        return await this.productsDAO.deleteProduct(id)
    }

}

export const productsService = new ProductsService(DAO)