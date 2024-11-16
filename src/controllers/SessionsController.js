import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import { catchError } from "../utils.js";



export class SessionsController {

    static createUser = async (req, res) => {

        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: "Account created to", newUser: req.user })
        } catch (error) {
            return catchError(res, error)
        }


    }

    static loginLocal = async (req, res) => {

        try {
            let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 })
            res.cookie("tokenCookie", token, { httpOnly: true })

            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: "You logged in successfully", user: req.user })

        } catch (error) {
            return catchError(res, error)
        }

    }

    static loginGitHub = async (req, res) => {

        try {
            let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });
            res.cookie("tokenCookie", token, { httpOnly: true });
    
            const isApiRequest = req.headers['accept']?.includes('application/json')
            if (isApiRequest) {
                return res.status(200).json({ message: "You logged in successfully", user: req.user })
            } else {
                return res.redirect(`/products?message= Welcome, ${req.user.first_name} | Email: ${req.user.email} | Role: ${req.user.role}`)
            }
            
        } catch (error) {
            return catchError(res, error)
        }

    }

    static logout = async (req, res) => {

        try {
            res.clearCookie("tokenCookie")

            const isApiRequest = req.headers['accept']?.includes('application/json')
            if (isApiRequest) {
                return res.status(200).json({ message: 'Logout successful.' })
            } else {
                return res.redirect(`/login?message=Logout successful.`)
            }

        } catch (error) {
            return catchError(res, error)
        }
    }

    static current = async (req, res) => {

        try {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ message: "User logged", user: req.user })
            
        } catch (error) {
            return catchError(res, error)
        }
    }
}