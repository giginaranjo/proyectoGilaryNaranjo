import { productsService } from "../repository/ProductsService.js";
import { isValidObjectId } from "mongoose";
import { catchError } from "../utils.js";

export class ProductsController{

    static getProducts = async (req, res) => {

        let { page, limit, sort, ...filters } = req.query
    
        // Validaciones de existencia y formato
        if (!limit || isNaN(Number(limit))) {
            limit = 10
        }
        if (!page || isNaN(Number(page))) {
            page = 1
        }
    
        // Ordenar por (asc or desc)
        if (sort) {
            let sortBy;
            if (sort.toLowerCase() === "asc" || sort == 1) {
                sortBy = 1
            } else if (sort.toLowerCase() === "desc" || sort == -1) {
                sortBy = -1
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Invalid sort value` })
            }
            sort = { price: sortBy }
        }
    
        // Filtro (category)
        let filter = {}
    
        Object.keys(filters).forEach(key => {
            const keyLower = key.toLowerCase()
            if (keyLower === "category") {
                filter[keyLower] = filters[keyLower].toUpperCase()
            }
        })
    
        try {
    
            let product = await productsService.getProductsBy(filter);
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Category not found` })
            }
    
    
            let products = await productsService.getProductsPaginate(filter, page, limit, sort)
    
            products.products = products.docs
            delete products.docs
            delete products.totalDocs
            delete products.pagingCounter
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ status: "success", payload: { ...products } })
    
        } catch (error) {
            return catchError(res, error)
        }
    }

    static getProductById = async (req, res) => {
        let { pid } = req.params
    
        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }
    
        try {
            // Validación existencia de producto por id
            let product = await productsService.getProductsById({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(product)
    
        } catch (error) {
            return catchError(res, error)
        }
    }

    static createProduct = async (req, res) => {
        let newProduct = req.body
    
        // Validaciones de campo y formato
        if (!newProduct.title.trim() || !newProduct.description.trim() || !newProduct.code || newProduct.code == " " || !newProduct.price || newProduct.price == " " || !newProduct.stock || newProduct.stock == " " || !newProduct.category.trim()) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Complete the required fields' })
        }
    
        if (newProduct.price < 0 || newProduct.stock < 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Enter a valid value' })
        }
    
    
        try {
            let addedProduct = await productsService.addProduct(newProduct)
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ addedProduct })
    
        } catch (error) {
            return catchError(res, error)
        }
    }

    static modifyProductById = async (req, res) => {
        let { pid } = req.params
    
        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }
    
        try {
            // Validación existencia de producto por id
            let product = await productsService.getProductsById({ _id: pid });
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
    
    
            let modifiedProduct = await productsService.modifyProduct(pid, modification)
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ modifiedProduct })
    
        } catch (error) {
            return catchError(res, error)
        }
    }

    static deleteProductById = async (req, res) => {
        let { pid } = req.params
    
        // Formato id (cadena hexadecimal de 24 caracteres)
        if (!isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Invalid id format` })
        }
    
        try {
    
            // Validación existencia de producto por id
            let product = await productsService.getProductsById({ _id: pid });
            if (!product) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Product not found` })
            }
    
    
    
            let deletedProduct = await productsService.deleteProduct(pid)
            if (deletedProduct === 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({ error: 'An error occurred while trying to delete the product' })
            }
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "The product has been removed" })
    
        } catch (error) {
            return catchError(res, error)
        }
    }
}