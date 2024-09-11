import { Router } from "express";
// import ProductsManager from "../dao/productManager.js"
import { MongoProductsManager as ProductsManager } from "../dao/mongoProductManager.js";
import { productsModel } from "../dao/models/productModel.js";
import { isValidObjectId } from "mongoose";

const router = Router()


// OBTENER PRODUCTOS
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


// OBTENER PRODUCTO POR ID
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


// CREAR/AÑADIR PRODUCTO
router.post("/", async (req, res) => {
    let newProduct = req.body

    // Validaciones de campo y formato
    if (!newProduct.title.trim() || !newProduct.description.trim() || !newProduct.code.trim() || !newProduct.price || newProduct.price == " " || !newProduct.stock || newProduct.stock == " " || !newProduct.category.trim()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Complete the required fields' })
    }

    if (newProduct.price < 0 || newProduct.stock < 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Enter a valid value' })
    }

    // LLamado del manager (guardado del nuevo producto)
    try {
        let addedProduct = await ProductsManager.addProduct(newProduct)

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ addedProduct })

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


// MODIFICAR PRODUCTO
router.put("/:pid", async (req, res) => {
    let { pid } = req.params

    // Formato id (cadena hexadecimal de 24 caracteres)
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid id format` })
    }

    // Validación existencia de producto por id
    let product = await productsModel.findById(pid);
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Product not found` })
    }


    let modification = req.body
    delete modification._id


    // Validaciones de campo y formato
    const validFields = Object.values(modification).some(value => value !== "" && value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0))
    if (!validFields) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Complete the required fields' })
    }

    if (modification.price === null || modification.price === "" || modification.price < 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Enter a valid value' })
    }

    if (modification.stock === null || modification.stock === "" || modification.stock < 0) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Enter a valid value' })
    }


    // LLamado del manager (guardado de items modificados)
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


// ELIMINACIÓN DE PRODUCTO
router.delete("/:pid", async (req, res) => {
    let { pid } = req.params

    // Formato id (cadena hexadecimal de 24 caracteres)
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid id format` })
    }

    // Validación existencia de producto por id
    let product = await productsModel.findById(pid);
    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Product not found` })
    }

    // LLamado del manager (eliminación de producto por id)
    try {
        let deletedProduct = await ProductsManager.deleteProduct(pid)

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