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


// REALIZAR EL PEDIDO
router.post("/:cid/purchase", authenticate("current"), auth(["USER"]), CartsController.purchaseCart)


// MODIFICAR CARRITO
router.put("/:cid", authenticate("current"), auth(["USER"]), CartsController.updateCart)


// MODIFICAR CANTIDAD DEL PRODUCTO EN CARRITO
router.put("/:cid/products/:pid", authenticate("current"), auth(["USER"]), CartsController.updateCartProduct)


// ELIMINAR PRODUCTO 
router.delete("/:cid/products/:pid", authenticate("current"), auth(["USER"]), CartsController.deleteProductCartById)


// VACIAR CARRITO (ELIMINAR TODOS LOS PRODUCTOS, CONSERVAR EL CARRITO)
router.delete("/:cid", authenticate("current"), auth(["USER"]), CartsController.emptyCart)