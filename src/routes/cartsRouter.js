import { Router } from "express";
import CartsManager from "../dao/cartsManager.js";

const router = Router()

router.get("/", async (req, res) => {
    let carts
    try {
        carts = await CartsManager.getCarts()
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(carts)

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor. Intente más tarde.`,
            detalle: `${error.message}`
        });
    }

})

router.post("/", async (req, res) => {
    let newCart = req.body

    if (newCart.products.length === 0 || !Array.isArray(newCart.products)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Check and re-enter the required fields' })
    } 

    try {
        let addedCart = await CartsManager.createCart(newCart)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ addedCart })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: 'Error inesperado en el servidor. Intente más tarde.',
                detalle: `${error.message}`
            }
        )
    }
})

router.get("/:cid", async (req, res) => {
    try {
        let carts = await CartsManager.getCarts()
        let cart = carts.find(c => c.id === parseInt(req.params.cid));
        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Product not found` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(cart)

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: 'Error inesperado en el servidor. Intente más tarde.',
                detalle: `${error.message}`
            }
        )
    }
})


router.post("/:cid/product/:pid", async (req, res) => {
    let cid = parseInt(req.params.cid)
    let pid = parseInt(req.params.pid) 

    try {
        let addedProduct = await CartsManager.addProduct(cid, pid)
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message: 'Product added successfully', cart: addedProduct })

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: 'Error inesperado en el servidor. Intente más tarde.',
                detalle: `${error.message}`
            }
        )
    }
})

export default router;