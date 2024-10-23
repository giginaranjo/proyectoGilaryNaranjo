export const auth = (req, res, next) => {
    if (!req.session.user) {

        const isApiRequest = req.headers['accept']?.includes('application/json')

        if (isApiRequest) {
            return res.status(401).json({ error: 'No authenticated users.' });
        } else {
            return res.redirect(`/login?message=No authenticated users.`);
        }
    }

    return next()
}