import { Router } from "express";
import { auth } from "../middleware/auth.js";
import passport from "passport";

export const router = Router()


router.get("/error", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(401).json({ error: `Authentication error` })
})

// INGRESO LOCAL 

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/error" }), (req, res) => {
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ message: "Account created to", newUser: req.user })
    
})


router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/error" }), (req, res) => {
    
    req.session.user = req.user
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ message: "You logged in successfully", user: req.user })
    
})

// INGRESO GITHUB

router.get("/github", passport.authenticate("github", {}))

router.get("/callbackgithub", passport.authenticate("github", { failureRedirect: "/api/sessions/error" }), (req, res) => {
    
    if (!req.session) {
        return console.log("auxilio");
    }
    req.session.user = req.user
    
    const isApiRequest = req.headers['accept']?.includes('application/json')

        if (isApiRequest) {
            return res.status(200).json({ message: "You logged in successfully", user: req.user });
        } else {
            return res.redirect(`/products?name=${req.user.name}&email=${req.user.email}&rol=${req.user.rol}`);
        }
    
})

// LOGOUT

router.get("/logout", auth, async (req, res) => {

    req.session.user = req.user

    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Unexpected server error.` })
        }

        const isApiRequest = req.headers['accept']?.includes('application/json')

        if (isApiRequest) {
            return res.status(200).json({ message: 'Logout successful.' });
        } else {
            return res.redirect(`/login?message=Logout successful.`);
        }

    })  

})