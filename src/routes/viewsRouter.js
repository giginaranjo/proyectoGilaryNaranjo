import { Router } from "express";
import ProductsManager from "../dao/productManager.js"

const router = Router()

// Obtener listado de productos

router.get("/", async (req, res) => {
    let products
    try {
        products = await ProductsManager.getProducts()
        res.setHeader('Content-Type', 'text/html'); 
        res.status(200).render('home', {products})
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor. Intente más tarde.`,
            detalle: `${error.message}`
        });
    }
})


router.get("/realTimeProducts", (req, res) => {


    
    res.setHeader('Content-Type', 'text/html'); 
    res.status(200).render('realTimeProducts')
})

export default router;