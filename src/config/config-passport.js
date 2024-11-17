import passport from "passport"
import local from "passport-local"
import github from "passport-github2"
import passportJwt from "passport-jwt"
import { CartsManagerMongo as CartsManager } from "../dao/cartsManagerMongo.js"
import { createHash, validateHash } from "../utils.js"
import { config } from "./config.js"
import { usersService } from "../repository/UsersService.js"
import { UsersDTO } from "../dto/UsersDTO.js"

const searchToken = req => {

    let token = null
    if (req.cookies.tokenCookie) {
        token = req.cookies.tokenCookie
    }

    return token
}


export const initPassport = () => {

    passport.use("register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { first_name, last_name, age } = req.body
                    age = Number(age)

                    if (!first_name.trim() || !last_name.trim() || !age || !username || !password || password == " ") {
                        return done(null, false, { message: 'Complete the required fields' })
                    }

                    if (!UsersDTO.validName(first_name) || !UsersDTO.validName(last_name)) {
                        return done(null, false, { message: 'First name or last name contains invalid characters. Only letters are allowed.' });
                    }

                    if (isNaN(age) || age < 18) {
                        return done(null, false, { message: 'You must be over 18 years old to make the purchase.' });
                    }

                    if (!UsersDTO.validEmail(username)) {
                        return done(null, false, { message: 'Wrong email format' })
                    }

                    let exist = await usersService.getUserByEmail({ email: username })
                    if (exist) {
                        return done(null, false, { message: `This email ${username} is already being used with another account. Please check your email and try again or log in.` })
                    }

                    password = createHash(password)

                    let newCart = await CartsManager.createCart()

                    let newUserDTO = new UsersDTO({
                        first_name,
                        last_name,
                        age,
                        email: username,
                        password,
                        cart: newCart._id
                    })

                    let newUser = await usersService.createUser(newUserDTO)
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

                    if (!UsersDTO.validEmail(username)) {
                        return done(null, false, { message: 'Wrong email format' })
                    }

                    let user

                    if (username == config.USER_NAME_ADMIN && password == config.PASSWORD_ADMIN) {
                        user = { first_name: "Admin", email: username, role: "ADMIN" }

                    } else {

                        user = await usersService.getUserByEmail({ email: username })
                        if (!user) {
                            return done(null, false, { message: `Invalid credentials. Please check the data and try again.` })
                        }

                        if (!validateHash(password, user.password)) {
                            return done(null, false, { message: `Invalid credentials. Please check the data and try again.` })
                        }

                    }

                    user = UsersDTO.deletePassword(user)
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
                        return done(null, false, { message: `Your account does not have the required information. Update your GitHub account information and try again.` })
                    }

                    let userDB = await usersService.getUserByEmail({ email })
                    if (!userDB) {
                        let newCart = await CartsManager.createCart()
                        let newUserDTO = new UsersDTO({
                            first_name: name,
                            email,
                            cart: newCart._id,
                            role: "USER"
                        })

                        userDB = await usersService.createUser({ ...newUserDTO , profileGitHub: profile })
                    }

                    let { profileGitHub, ...user } = userDB
                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use("current",
        new passportJwt.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: new passportJwt.ExtractJwt.fromExtractors([searchToken])
            },
            async (user, done) => {
                try {
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
}