const userMiddleware = {

    //Checks if the session has a user.
    //If yes > user is authenticated.
    //If no > 401 Unauthorized.

    isAuthenticated(req, res, next) {
        if (req.session?.user) {
            return next();
        }
        return res.status(401).json({
            success: false,
            status: 401,
            message: 'Unauthorized: Please log in'
        });
    },

    authorizeRoles(...allowedRoles) {
        // allowedRoles = array of roles that can access this route
        // e.g. authorizeRoles("admin", "service_provider")

        return (req, res, next) => {
            const userRole = req.session?.user?.role;

            //Check if the user's role exists in the allowed roles
            if (allowedRoles.includes(userRole)) {
                return next();
            }
            return res.status(403).json({
                success: false,
                status: 403,
                message: 'Forbidden: Access Denied'
            });
        };
    }

};

export default userMiddleware;
