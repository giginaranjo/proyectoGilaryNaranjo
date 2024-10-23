import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import { UserManagerMongo as UserManager } from "../dao/userManagerMongo.js"
import { createHash, validateHash } from "../utils.js"
import {config} from "./config.js"

export const initPassport = () => {

    passport.use("register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { name } = req.body
                    if (!name) {
                        return done(null, false)
                    }

                    let exist = await UserManager.getBy({ email: username })
                    if (exist) {
                        return done(null, false)
                    }

                    password = createHash(password)
                    let newUser = await UserManager.createUser({ name, email: username, password })
                    return done(null, newUser)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    let user = await UserManager.getBy({ email: username })
                    if (!user) {
                        return done(null, false)
                    }

                    if (!validateHash(password, user.password)) {
                        return done(null, false)
                    }

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("github",
        new github.Strategy(
            {
                clientID: config.GITHUB_CLIENT_ID,
                clientSecret: config.GITHUB_CLIENT_SECRET,
                callbackURL: config.GITHUB_CALLBACK_URL
            },
            async (token, rt, profile, done) => {
                try {

                    let { name, email } = profile._json
                    if (!name || !email) {
                        return done(null, false)
                    }

                    let user = await UserManager.getBy({ email })
                    if (!user) {
                        user = await UserManager.createUser({ name, email, profileGithub: profile })
                    }

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )


    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        let user = await UserManager.getBy({_id:id})
        return done(null, user)
    })
}