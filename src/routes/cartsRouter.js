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
    let cartExist = await CartsManager.getBy(cid);
    if (!cartExist) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Cart not found` })
    }


    try {
        let cart = await CartsManager.getBy(cid)
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
        let cart = await CartsManager.getBy(cid);
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


// MODIFICAR CARRITO
router.put("/:cid", async (req, res) => {
    let { cid } = req.params


    // Formato id (cadena hexadecimal de 24 caracteres)
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid id format` })
    }

    try {
        // Validación existencia de carrito en coll. por id
        let cart = await CartsManager.getBy(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }


        let modification = req.body
        delete modification._id


        // Validaciones de campo y formato
        const validFields = Object.values(modification).some(value => !Array.isArray(value) || value.length > 0)
        if (!validFields) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Complete the required fields' })
        }


        let modifiedCart = await CartsManager.modifyCart(cid, modification)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ modifiedCart })

    } catch (error) {
        return catchError(res, error)
    }
})


// MODIFICAR CANTIDAD DEL PRODUCTO EN CARRITO
router.put("/:cid/products/:pid", async (req, res) => {
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
        let product = await ProductsManager.getProductsBy({ _id: pid });
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Product not found` })
        }

        // Validación existencia de carrito en coll. por id
        let cart = await CartsManager.getBy(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }

        let productExist = cart.products.some(p => p.product === pid)
        if (!productExist) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Product not found in cart` })
        }
    
        
        let {quantity} = req.body
        
        // Validación formato
        if (quantity === null || quantity === "" || quantity < 0 || isNaN(Number(quantity))) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Enter a valid value' })
        }


        let modifiedProduct = await CartsManager.updateCart(cid,pid,Number(quantity))

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ modifiedProduct })

    } catch (error) {
        return catchError(res, error)
    }
})

// ELIMINAR PRODUCTOS INDIVIDUALMENTE
router.delete("/:cid/products/:pid", async (req, res) => {
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
        let cart = await CartsManager.getBy(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }

        // Validación existencia de producto en coll. por id
        let product = await ProductsManager.getProductsBy({ _id: pid });
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Product not found` })
        }

        let productExist = cart.products.some(p => p.product === pid)
        if (!productExist) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Product not found in cart` })
        }
        
    

        let deletedProduct = await CartsManager.deleteProductCart(cid, pid)
        if (deletedProduct === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: 'An error occurred while trying to delete the product' })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "The product has been removed", updateCart: {deletedProduct} })

    } catch (error) {
        return catchError(res, error)
    }
})

// VACIAR CARRITO (ELIMINAR TODOS LOS PRODUCTOS, CONSERVAR EL CARRITO)
router.delete("/:cid", async (req, res) => {
    let { cid } = req.params


    // Formato id (cadena hexadecimal de 24 caracteres)
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid id format` })
    }

    try {
        // Validación existencia de carrito en coll. por id
        let cart = await CartsManager.getBy(cid);
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Cart not found` })
        }


        let emptyCart = await CartsManager.emptyCart(cid)
        if (!emptyCart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: 'An error occurred while trying to delete the products' })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({payload: "The products has been removed", updateCart: {emptyCart} })

    } catch (error) {
        return catchError(res, error)
    }
})