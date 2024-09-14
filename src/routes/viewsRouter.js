import { Router } from "express";
/* import ProductsManager from "../dao/productManager.js" */
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";
import { catchError } from "../utils.js";

export const router = Router()

// Obtener listado de productos

router.get("/products", async (req, res) => {
    /* let {limit, page} = req.query
    if (!limit|| isNaN(Number(limit))) {
        limit = 1
    }
    if (!page || isNaN(Number(page))) {
        page = 1
    } */
    try {
        /* let products = await ProductsManager.get(page) */
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index'/* , { products } */)

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

