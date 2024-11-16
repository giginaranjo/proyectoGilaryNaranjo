import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";
import { authenticate } from "../utils.js";
import { auth } from "../middlewares/auth.js";

export const router = Router()


// OBTENER PRODUCTOS
router.get("/", ProductsController.getProducts )


// OBTENER PRODUCTO POR ID
router.get("/:pid", ProductsController.getProductById)


// CREAR/AÑADIR PRODUCTO
router.post("/", authenticate("current"), auth(["ADMIN"]), ProductsController.createProduct)


// MODIFICAR PRODUCTO
router.put("/:pid", authenticate("current"), auth(["ADMIN"]), ProductsController.modifyProductById)


// ELIMINACIÓN DE PRODUCTO
router.delete("/:pid", authenticate("current"), auth(["ADMIN"]), ProductsController.deleteProductById)

