import express, { Router } from 'express';
import { login, register, resetPassword } from '../controllers/authController';

const router: Router = express.Router();

// Rotas de autenticação
router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);

export default router;
