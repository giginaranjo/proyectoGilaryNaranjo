/* import CartsManager from "../dao/cartsManager.js"; */
import { CartsManagerMongo as DAO } from "../dao/cartsManagerMongo.js"
import { CartsDTO } from "../dto/CartsDTO.js"


class CartsService{
    constructor(dao){
        this.cartsDAO = dao
    }

    async getCarts(){
        let carts = await this.cartsDAO.get()

        if (Array.isArray(carts)) {
            carts = carts.map(c => new CartsDTO(c))
        } else { 
            carts = new CartsDTO(carts)
        }

        return carts
    }

    async getCartById(id){
        let cart = await this.cartsDAO.getBy(id)

        if (Array.isArray(cart)) {
            cart = cart.map(c => new CartsDTO(c))
        } else if (cart) { 
            cart = new CartsDTO(cart)
        }

        return cart
    }

    async createCart(){
        return await this.cartsDAO.createCart()
    }

    async addProduct(id, cart){
        return await this.cartsDAO.addProduct( id , cart)
    }

    async updateCart(filter, cart){
        return await this.cartsDAO.updateCart(filter, cart)
    }

    async modifyCart(id, modification){
        return await this.cartsDAO.modifyCart(id, modification)
    }

    async updateCartProduct(cid, pid, quantity){
        return await this.cartsDAO.updateCartProduct(cid, pid, quantity)
    }

    async deleteProductCart(cid, pid){
        return await this.cartsDAO.deleteProductCart(cid, pid)
    }

    async emptyCart(cid, pid){
        return await this.cartsDAO.emptyCart(cid, pid)
    }


}

export const cartsService = new CartsService(DAO)