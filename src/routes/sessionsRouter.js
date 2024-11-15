import { Router } from "express";
import { authenticate } from "../utils.js";
import { SessionsController } from "../controllers/SessionsController.js";

export const router = Router()


// INGRESO LOCAL 

router.post("/register", authenticate("register"), SessionsController.createUser)

router.post("/login", authenticate("login"), SessionsController.loginLocal)

// INGRESO GITHUB

router.get("/github", authenticate("github"))

router.get("/callbackgithub", authenticate("github"), SessionsController.loginGitHub);


// LOGOUT

router.get("/logout", authenticate("current"), SessionsController.logout)

// USUARIO ACTUAL

router.get("/current", authenticate("current"), SessionsController.current)