import { Router } from "express";
import jwt from "jsonwebtoken"
import { authenticate, infoUser } from "../utils.js";
import { config } from "../config/config.js"

export const router = Router()


router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({ error: `Authentication error` })
})

// INGRESO LOCAL 

router.post("/register", authenticate("register"), (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ message: "Account created to", newUser: req.user })

})


router.post("/login", authenticate("login"), (req, res) => {

    let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 })
    res.cookie("tokenCookie", token, {httpOnly: true})

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ message: "You logged in successfully", user: req.user })

})

// INGRESO GITHUB

router.get("/github", authenticate("github"))

router.get("/callbackgithub", authenticate("github"), (req, res) => {
    
    let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 })
    res.cookie("tokenCookie", token, {httpOnly: true})


    const isApiRequest = req.headers['accept']?.includes('application/json')

        if (isApiRequest) {
            return res.status(200).json({ message: "You logged in successfully", user: req.user });
        } else {
            return res.redirect(`/products?name=${req.user.first_name}&email=${req.user.email}&rol=${req.user.role}`);
        }
    
})


// LOGOUT

router.get("/logout", authenticate("current"), async (req, res) => {

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
})

router.get("/current", authenticate("current"), async (req, res) => {

   res.setHeader('Content-Type', 'application/json'); 
   return res.status(200).json({ message: "User logged", user: req.user })
})