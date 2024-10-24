import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
import passport from "passport";

// PATH
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// ERROR (500)
export const catchError = (res, error) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            status: 'error',
            error: 'Unexpected server error. Try later.',
            detalle: `${error.message}`
        }
    )
}

// HASHEO
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validateHash = (password, hash) => bcrypt.compareSync(password, hash)


// AUTENTICACIÓN 

export const authenticate = fn => function (req, res, next) {
    passport.authenticate(fn, function (err, user, info, status) {
        if (err) { return next(err) }

        if (!user) {
            const isApiRequest = req.headers['accept']?.includes('application/json')
            if (isApiRequest) {
                return res.status(401).json({ error: `${info.message ? info.message : info.toString()}` });
            } else {
                return res.redirect(`/login?message=${info.message ? info.message : info.toString()}`);
            }
        }
        
        req.user = user
        return next()
    })(req, res, next)
}


export const infoUser = (req, res, next) => {
    passport.authenticate("current", { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        req.user = user || null
        next()
    })(req, res, next)
}