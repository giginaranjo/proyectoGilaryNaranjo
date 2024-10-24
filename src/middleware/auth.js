/* export const auth = (req, res, next) => {
    if (!req.session.user) {

        const isApiRequest = req.headers['accept']?.includes('application/json')

        if (isApiRequest) {
            return res.status(401).json({ error: 'No authenticated users.' });
        } else {
            return res.redirect(`/login?message=No authenticated users.`);
        }
    }

    return next()
} */
/* 
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"

export const auth = role => {(req, res, next) => {
    if (!req.user || !req.user?.role) {
        const isApiRequest = req.headers['accept']?.includes('application/json')
        if (isApiRequest) {
            return res.status(403).json({ error: 'No authorizated users.' });
        } else {
            return res.redirect(`/login?message=No authorizated users.`);
        }

        if (!req.user || !req.user?.role) {
            const isApiRequest = req.headers['accept']?.includes('application/json')
            if (isApiRequest) {
                return res.status(403).json({ error: 'No authorizated users.' });
            } else {
                return res.redirect(`/login?message=No authorizated users.`);
            }
    
            
        }}

    return next()
}} */