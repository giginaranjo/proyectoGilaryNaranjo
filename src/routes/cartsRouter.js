import { Router } from "express";
import { CartsController } from "../controllers/CartsController.js";
import { authenticate } from "../utils.js";
import { auth } from "../middlewares/auth.js";

export const router = Router()


//OBTENER CARRITOS
router.get("/", CartsController.getCarts)


//OBTENER CARRITO POR ID
router.get("/:cid", CartsController.getCartById)


//CREAR CARRITO
router.post("/", CartsController.createCart)


//AÑADIR PRODUCTO AL CARRITO
router.post("/:cid/products/:pid", authenticate("current"), auth(["USER"]), CartsController.addProduct)


// MODIFICAR CARRITO
router.put("/:cid", CartsController.modifyCartById)


// MODIFICAR CANTIDAD DEL PRODUCTO EN CARRITO
router.put("/:cid/products/:pid", CartsController.updateCart)


// ELIMINAR PRODUCTO 
router.delete("/:cid/products/:pid", CartsController.deleteProductCartById)


// VACIAR CARRITO (ELIMINAR TODOS LOS PRODUCTOS, CONSERVAR EL CARRITO)
router.delete("/:cid", CartsController.emptyCart)