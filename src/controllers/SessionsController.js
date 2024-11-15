import jwt from "jsonwebtoken"
import { config } from "../config/config.js"



export class SessionsController{

    static createUser = async (req, res) => {

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ message: "Account created to", newUser: req.user })
    
    }

    static loginLocal = async (req, res) => {

        let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 })
        res.cookie("tokenCookie", token, { httpOnly: true })
    
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "You logged in successfully", user: req.user })
    
    }

    static loginGitHub= async (req, res) => {

        let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });
        res.cookie("tokenCookie", token, { httpOnly: true });
    
        const isApiRequest = req.headers['accept']?.includes('application/json')
        if (isApiRequest) {
            return res.status(200).json({ message: "You logged in successfully", user: req.user })
        } else {
            return res.redirect(`/products?name=${req.user.first_name}&email=${req.user.email}&role=${req.user.role}`)
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
            es.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Unexpected server error.` })
        }
    }

    static current = async (req, res) => {

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "User logged", user: req.user })
    }
}