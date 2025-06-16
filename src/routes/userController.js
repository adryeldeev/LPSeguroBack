
import Router from 'express';
import { createUser, login } from '../controllers/userController.js';
7
const router = Router();

// Define the routes for user management
router.post('/userCreate', createUser)
router.post('/user', login); // Create a new user 

// router.post('/requestpassword', ResertPasswordController.requestPasswordReset); 
// router.post('/resetpassword', ResertPasswordController.resetPassword); 

export default router;