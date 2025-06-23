import express from 'express';
import { login, register, forgotpassword, adminlogin, resetpassword, getname, getUserById, getAllUsers, updateUser, deleteUser } from '../controller/Usercontroller.js';
import authMiddleware from '../middleware/authmiddleware.js';
import upload from "../middleware/multer.js";

const userrouter = express.Router();

userrouter.post('/login', login);
userrouter.post('/register', register);
userrouter.post('/forgot', forgotpassword);
userrouter.post('/reset/:token', resetpassword);
userrouter.post('/admin', adminlogin);

userrouter.get('/all', getAllUsers);
userrouter.put('/:id', upload.single("avatar"), updateUser);
userrouter.delete('/:id', deleteUser);


userrouter.get('/me', authMiddleware, getname);

userrouter.get('/profile/:id', authMiddleware, getUserById);
export default userrouter;