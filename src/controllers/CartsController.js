import { productsService } from "../repository/ProductsService.js";
import mongoose, { isValidObjectId } from "mongoose";
import { catchError, codePurchase } from "../utils.js";
import { cartsService } from "../repository/CartsService.js";
import { ticketService } from "../repository/TicketService.js";
import { TicketDTO } from "../dto/ticketDTO.js";

export class CartsController {

    static getCarts = async (req, res) => {
        try {
            let carts = await cartsService.getCarts()
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(carts)

        } catch (error) {
            return catchError(res, error)
        }

    }

    static getCartById = async (req, res) => {
        let { cid } = req.params

        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }

        // Validación existencia de carrito por id
        let cartExist = await cartsService.getCartById(cid);
        if (!cartExist) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }


        try {
            let cart = await cartsService.getCartById(cid);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ cart })

        } catch (error) {
            return catchError(res, error)
        }
    }

    static createCart = async (req, res) => {
        try {
            let addedCart = await cartsService.createCart()

            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ addedCart })
        } catch (error) {
            return catchError(res, error)
        }
    }

    static addProduct = async (req, res) => {
        let { cid, pid } = req.params

        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid cart id format` })
        }
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid product id format` })
        }

        try {
            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }

            // Validación existencia de producto en coll. por id
            let product = await productsService.getProductsById({ _id: pid })
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }

            // Validación existencia de producto en carrito por indice
            let productExist = cart.products.findIndex(p => p.product._id == pid)
            if (productExist === -1) {
                cart.products.push(
                    {
                        product: pid,
                        quantity: 1
                    }
                )
            } else {
                cart.products[productExist].quantity++
            }


            let addedProduct = await cartsService.addProduct(cid, cart)
            if (addedProduct.modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ message: 'Product added successfully' })
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'An error occurred while trying to add the product' })
            }

        } catch (error) {
            return catchError(res, error)
        }
    }

    static purchaseCart = async (req, res) => {

        let { cid } = req.params

        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }

        // Validación de pertenencia del carrito 
        if (req.user.cart._id != cid) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart id entered does not belong to the authenticated user` })
        }

        try {

            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }


            let withStock = []
            let withoutStock = []
            let error = false

            for (let i = 0; i < cart.products.length; i++) {
                let pid = cart.products[i].product._id
                let quantity = cart.products[i].quantity
                let product = await productsService.getProductsById(pid)


                if (!product || product.stock < quantity) {
                    withoutStock.push(
                        {
                            product: pid,
                            quantity: quantity
                        }
                    )
                    error = true

                } else {
                    if (product.stock >= quantity) {
                        withStock.push(
                            {
                                pid,
                                quantity,
                                price: product.price,
                                title: product.title,
                                subtotal: product.price * quantity

                            }
                        )

                        product.stock = product.stock - quantity
                        await productsService.modifyProduct(pid, product)

                    } else {
                        withoutStock.push(
                            {
                                product: pid,
                                quantity: quantity
                            }
                        )
                        error = true

                    }
                }
            }


            if (withStock.length == 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `The order cannot be placed due to lack of stock in the selected products.` })
            }

            let code = codePurchase()
            let purchase_datetime = new Date().toISOString().replace('T', ' ').substring(0, 19);
            let amount = withStock.reduce((acum, p) => acum += p.quantity * p.price, 0)
            let purchaser = req.user.email

            let orderDTO = new TicketDTO({
                code,
                purchase_datetime,
                amount,
                purchaser
            })

            let ticket = await ticketService.createTicket(orderDTO)


            cart.products = withoutStock
            await cartsService.updateCart({_id:cid}, cart)


            if (error) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ ticket, warning: "Important: Some items could not be processed due to lack of stock." })
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(ticket)
            }


        } catch (error) {
            catchError(res, error)
        }
    }

    static updateCart = async (req, res) => {
        let { cid } = req.params


        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }

        try {
            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }


            let modification = req.body
            delete modification._id
            let pid = modification.products[0].product


            // Validación existencia de producto en coll. por id
            let product = await productsService.getProductsById({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }

            // Validaciones de campo y formato
            const validFields = Object.values(modification).some(value => !Array.isArray(value) || value.length > 0)
            if (!validFields) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'Complete the required fields' })
            }


            let modifiedCart = await cartsService.modifyCart(cid, modification)

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ modifiedCart })

        } catch (error) {
            return catchError(res, error)
        }
    }

    static updateCartProduct = async (req, res) => {
        let { cid, pid } = req.params

        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid cart id format` })
        }
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid product id format` })
        }

        try {
            // Validación existencia de producto en coll. por id
            let product = await productsService.getProductsById({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }

            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }

            // Validación existencia de producto en carrito por id
            let objId = new mongoose.Types.ObjectId(pid)
            let productExist = cart.products.some(p => p.product._id.equals(objId))
            if (!productExist) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found in cart` })
            }


            let { quantity } = req.body

            // Validación formato
            if (quantity === null || quantity === "" || quantity < 0 || isNaN(Number(quantity))) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: 'Enter a valid value' })
            }


            let modifiedProduct = await cartsService.updateCartProduct(cid, pid, Number(quantity))

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ modifiedProduct })

        } catch (error) {
            return catchError(res, error)
        }
    }

    static deleteProductCartById = async (req, res) => {
        let { cid, pid } = req.params

        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid cart id format` })
        }
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid product id format` })
        }

        try {

            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }

            // Validación existencia de producto en coll. por id
            let product = await productsService.getProductsById({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }

            // Validación existencia de producto en carrito por id
            let objId = new mongoose.Types.ObjectId(pid)
            let productExist = cart.products.some(p => p.product._id.equals(objId))
            if (!productExist) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found in cart` })
            }

            let deletedProduct = await cartsService.deleteProductCart(cid, pid)
            if (deletedProduct === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({ error: 'An error occurred while trying to delete the product' })
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "The product has been removed", updateCart: { deletedProduct } })

        } catch (error) {
            return catchError(res, error)
        }
    }

    static emptyCart = async (req, res) => {
        let { cid } = req.params


        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(cid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }

        try {
            // Validación existencia de carrito en coll. por id
            let cart = await cartsService.getCartById(cid);
            if (!cart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Cart not found` })
            }


            let emptyCart = await cartsService.emptyCart(cid)
            if (!emptyCart) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({ error: 'An error occurred while trying to delete the products' })
            }

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "The products has been removed", updateCart: { emptyCart } })

        } catch (error) {
            return catchError(res, error)
        }
    }

}