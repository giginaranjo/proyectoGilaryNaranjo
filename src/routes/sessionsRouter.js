import { Router } from "express";
import crypto from "crypto"
import { UserManagerMongo as UserManager } from "../dao/userManagerMongo.js";
import { config } from "../config/config.js";
import { catchError } from "../utils.js";

export const router = Router()

router.post("/register", async (req, res) => {
    let newUser = req.body
    newUser.password= String(newUser.password)
    
    // Validaciones de campo y formato

    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Complete the required fields' })
    }

    try {

        let exist = await UserManager.getBy({ email: newUser.email })
        if (exist) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `This email (${newUser.email}) is already being used with another account` })
        }

        newUser.password = crypto.createHmac("sha256", config.SECRET).update(newUser.password).digest("hex")

        let createdUser = await UserManager.createUser(newUser)

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ createdUser })


    } catch (error) {
        catchError(res, error)
    }
})


router.post("/login", async (req, res) => {
    let { email, password } = req.body

    password= String(password)

    // Validaciones de campo y formato

    if (!email.trim() || !password.trim()) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Complete the required fields' })
    }

    try {
        password = crypto.createHmac("sha256", config.SECRET).update(password).digest("hex")
        let user = await UserManager.getBy({ email, password })
        if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Invalid credentials` })
        }

        delete user.password

        req.session.user = user

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "logged in", user: user })

    } catch (error) {
        catchError(res, error)
    }
})


router.get("/logout", async (req, res) => {

    let user = req.session.user

    if (!user) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Not logged in.` })
    }

    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Unexpected server error.` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: `Logout successful.` })
    })

})