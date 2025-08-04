import express from 'express';
import userController from '../controllers/userController.js'
import { isAuthenticated } from '../middleware/userMiddleware.js';
import { authorizeRoles } from '../middleware/userMiddleware.js';


const router = express.Router();

router.post('/register', userController.createUser);


router.get('/get-all-users', isAuthenticated,  authorizeRoles("user"),userController.getAllUsers);

router.get('/get-all-users-admin', isAuthenticated, authorizeRoles("admin"),userController.getAllUsers);

router.post('/user-login', userController.userLogin);
router.post('/logout', userController.logout);



export default router;