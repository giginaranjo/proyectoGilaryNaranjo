import { Router } from "express";
/* import ProductsManager from "../dao/productManager.js" */
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";
import { catchError } from "../utils.js";
import { authenticate } from "../utils.js";

export const router = Router()

// Obtener listado de productos

router.get("/", async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
})

router.get("/products", async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
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
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })
    } catch (error) {
        catchError(res, error)
    }

})


router.get("/carts/:cid", authenticate("current"), async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('cartId', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/register", async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('register', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/login", async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('login', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/profile", authenticate("current"), async (req, res) => {
    try {

        const isApiRequest = req.headers['accept']?.includes('application/json')
        if (isApiRequest) {
            return res.status(200).json({ user: req.user });
        }

        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('profile', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
})