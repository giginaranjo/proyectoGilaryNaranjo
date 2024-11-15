/* import ProductsManager from "../dao/productManager.js" */
import { ProductsManagerMongo as ProductsManager } from "../dao/productManagerMongo.js";
import { catchError } from "../utils.js";

export class ViewsController{

    static Home = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('index', {
                user: req.user,
                inLogged: req.cookies.tokenCookie
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static getProducts = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            user: req.user,
            inLogged: req.cookies.tokenCookie
        })

    } catch (error) {
        catchError(res, error)
    }
}

    static getRealTimeProducts = async (req, res) => {
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
    
    }

    static getCart = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('cartId', {
                user: req.user,
                inLogged: req.cookies.tokenCookie
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static register = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('register', {
                user: req.user,
                inLogged: req.cookies.tokenCookie
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static login = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('login', {
                user: req.user,
                inLogged: req.cookies.tokenCookie
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }    

    static profile = async (req, res) => {
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
    }
}