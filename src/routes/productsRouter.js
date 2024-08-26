import { Router } from "express";
import ProductsManager from "../dao/productManager.js"

const router = Router()

router.get("/", async (req, res) => {
    let products
    try {
        products = await ProductsManager.getProducts()
        const { limit } = req.query
        if (limit) {
            products = products.slice(0, parseInt(limit))
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(products)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor. Intente más tarde.`,
            detalle: `${error.message}`
        });
    }

})

router.get("/:pid", async (req, res) => {
    try {
        let products = await ProductsManager.getProducts()
        let product = products.find(p => p.id === parseInt(req.params.pid));
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Product not found` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(product)

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


router.post("/", async (req, res) => {
    let products = await ProductsManager.getProducts()
    let newProduct = req.body
    if (!newProduct.title.trim() || !newProduct.description.trim() || !newProduct.code.trim() || !newProduct.price  || newProduct.price == " " || !newProduct.stock || newProduct.stock == " " || !newProduct.category.trim()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Complete the required fields' })
    }

    if(newProduct.price <0 || newProduct.stock <0){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Enter a valid value'})
    }

    let titleExist = products.find(p => p.title === newProduct.title)
    let codeExist = products.find(p => p.code === newProduct.code)

    if (titleExist || codeExist ) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'The value entered already belongs to a product' })
    }

    try {
        let addedProduct = await ProductsManager.addProduct(newProduct)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ addedProduct })
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

router.put("/:pid", async (req, res) => {
    let { pid } = req.params
    let products = await ProductsManager.getProducts()
    let product = products.find(p => p.id === parseInt(pid));
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Product not found` })
    }

    let modification = req.body
    delete modification.id

    try {
        let modifiedProduct = await ProductsManager.modifyProduct(pid, modification)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ modifiedProduct })

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

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params
    let products = await ProductsManager.getProducts()
    let product = products.find(p => p.id === parseInt(pid));
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Product not found` })
    }
    console.log(product);

    try {
        let deletedProduct = await ProductsManager.deleteProduct(pid)
        console.log(deletedProduct);

        if (deletedProduct === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: 'An error occurred while trying to delete the product' })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "El producto ha sido eliminado." })

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