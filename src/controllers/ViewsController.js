import { productsService } from "../repository/ProductsService.js";
import { catchError } from "../utils.js";

export class ViewsController{

    static Home = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('index', {
                user: req.user
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static getProducts = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('index', {
            user: req.user
        })

    } catch (error) {
        catchError(res, error)
    }
}

    static getRealTimeProducts = async (req, res) => {
        let products
        let user = req.user

        if (user.role.toUpperCase().includes("USER")) {
            return res.redirect(`/products?message= Unauthorized`)
        }

    
        try {
            products = await productsService.getProducts()
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('realTimeProducts', {
                products,
                user
            })
        } catch (error) {
            catchError(res, error)
        }
    
    }

    static getCart = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('cartId', {
                user: req.user
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static register = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('register', {
                user: req.user
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }

    static login = async (req, res) => {
        try {
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('login', {
                user: req.user
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
                user: req.user
            })
    
        } catch (error) {
            catchError(res, error)
        }
    }
}