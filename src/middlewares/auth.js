export const auth = (permissions = []) => {
    return (req, res, next) => {
        if (!Array.isArray(permissions)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: "Unexpected server error." })
        }
        
       permissions = permissions.map(p => p.toUpperCase()) 

       if (!req.user || !req.user.role) {
        res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: "Not authenticated" })
       }

       if(!permissions.includes(req.user.role.toUpperCase())){
        res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: "Unauthorized" })
       }

       next()

    }
}