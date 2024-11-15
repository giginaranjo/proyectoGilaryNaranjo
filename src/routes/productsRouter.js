import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";

export const router = Router()


// OBTENER PRODUCTOS
router.get("/", ProductsController.getProducts )


// OBTENER PRODUCTO POR ID
router.get("/:pid", ProductsController.getProductById)


// CREAR/AÑADIR PRODUCTO
router.post("/", ProductsController.createProduct)


// MODIFICAR PRODUCTO
router.put("/:pid", ProductsController.modifyProductById)


// ELIMINACIÓN DE PRODUCTO
router.delete("/:pid", ProductsController.deleteProductById)

