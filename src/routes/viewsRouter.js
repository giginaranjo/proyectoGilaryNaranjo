import { Router } from "express";
/* import ProductsManager from "../dao/productManager.js" */
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";
import { CartsManagerMongo as CartsManager} from "../dao/cartsManagerMongo.js";

import { catchError } from "../utils.js";

export const router = Router()

// Obtener listado de productos

router.get("/", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index')

    } catch (error) {
        catchError(res, error)
    }
})

router.get("/products", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index')

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/realTimeProducts", async (req, res) => {
    let products
    try {
        products = await ProductsManager.get()
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('realTimeProducts', { products })
    } catch (error) {
        catchError(res, error)
    }

})


router.get("/carts/:cid", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('cartId')

    } catch (error) {
        catchError(res, error)
    }
})
