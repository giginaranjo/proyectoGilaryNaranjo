import { Router } from "express";
/* import ProductsManager from "../dao/productManager.js" */
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";

import { catchError } from "../utils.js";
import { auth } from "../middleware/auth.js";

export const router = Router()

// Obtener listado de productos

router.get("/", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})

router.get("/products", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/realTimeProducts", async (req, res) => {
    let products
    try {
        products = await ProductsManager.get()
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('realTimeProducts', { 
            products,
            loggedIn: req.session.user
        })
    } catch (error) {
        catchError(res, error)
    }

})


router.get("/carts/:cid", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('cartId', {
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/register", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('register', {
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/login", async (req, res) => {  
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('login', {
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/profile", auth, async (req, res) => {  
    try {
        let user = req.session.user

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('profile', {
            user,
            loggedIn: req.session.user
        })

    } catch (error) {
        catchError(res, error)
    }
})