import { Router } from "express";
/* import CartsManager from "../dao/cartsManager.js"; */
import { CartsManagerMongo as CartsManager } from "../dao/cartsManagerMongo.js";
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";
import { isValidObjectId } from "mongoose";
import { catchError } from "../utils.js";


export const router = Router()

//OBTENER CARRITOS
router.get("/", async (req, res) => {
    try {
        let carts = await CartsManager.getCarts()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(carts)

    } catch (error) {
        return catchError(res, error)
    }

})


//OBTENER CARRITOS POR ID
router.get("/:cid", async (req, res) => {
    let { cid } = req.params

    // Formato id (cadena hexadecimal de 24 caracteres)
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid id format` })
    }

    // Validación existencia de carrito por id
    let cartExist = await CartsManager.getCartsBy(cid);
    if (!cartExist) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Cart not found` })
    }

    // Llamado al manager (mostrar producto)
    try {
        let cart = await CartsManager.getCartsBy(cid)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ cart })

    } catch (error) {
        return catchError(res, error)
    }
})


//CREAR CARRITO
router.post("/", async (req, res) => {
    try {
        let addedCart = await CartsManager.createCart()

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ addedCart })
    } catch (error) {
        return catchError(res, error)
    }
})


//AÑADIR PRODUCTO AL CARRITO
router.post("/:cid/product/:pid", async (req, res) => {
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
        let cart = await CartsManager.getCartsBy(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }

        // Validación existencia de producto en coll. por id
        let product = await ProductsManager.getProductsBy({ _id: pid })
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

        // Llamado al manager (añadir producto a carrito)
        let addedProduct = await CartsManager.addProduct(cid, cart)
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
})

