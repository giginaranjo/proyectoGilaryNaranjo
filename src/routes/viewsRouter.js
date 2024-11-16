import { Router } from "express";
import { authenticate } from "../utils.js";
import { ViewsController } from "../controllers/ViewsController.js";
import { auth } from "../middlewares/auth.js";

export const router = Router()


// Obtener listado de productos

router.get("/", ViewsController.Home)


router.get("/products", ViewsController.getProducts)


router.get("/realTimeProducts", authenticate("current"), ViewsController.getRealTimeProducts)


router.get("/carts/:cid", authenticate("current"), ViewsController.getCart)


router.get("/register", ViewsController.register)


router.get("/login", ViewsController.login)


router.get("/profile", authenticate("current"), ViewsController.profile)