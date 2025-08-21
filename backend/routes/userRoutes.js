import express from 'express';
import userController from '../controllers/userController.js'
import userMiddleware from '../middleware/userMiddleware.js';

const router = express.Router();

router.post('/service-provider-send-otp',
    userController.serviceProviderSendOTP
);

router.post('/provider-verify-otp',
    userController.providerVerifyOTP);

router.post('/register-service-provider', 
    userController.registerServiceProvider
);

router.get('/get-all-users',
    userMiddleware.isAuthenticated,
    userMiddleware.authorizeRoles("service_provider"),
    userController.getAllUsers
);

router.get('/get-all-users-admin',
    userMiddleware.isAuthenticated,  // must be logged in
    userMiddleware.authorizeRoles("admin"), // must have role "admin"
    userController.getAllUsersForAdmin // run controller if checks pass
);

router.post('/user-login',
    userController.userLogin
);

router.post('/logout',
    userController.logout
);

export default router;