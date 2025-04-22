import { Request, Response } from 'express';
import * as authService from '../services/authService';

// Controller para login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
      return;
    }
    
    const result = await authService.loginUser(email, password);
    
    if (!result.success) {
      res.status(401).json({ success: false, message: result.message });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

// Controller para registro
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Nome, email e senha são obrigatórios' 
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
      return;
    }

    const result = await authService.registerUser(name, email, password);
    
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }
    
    res.status(201).json({ 
      success: true, 
      user: result.user,
      message: 'Usuário registrado com sucesso' 
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

// Controller para reset de senha
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ success: false, message: 'Email é obrigatório' });
      return;
    }
    
    const result = await authService.initiatePasswordReset(email);
    
    // Sempre retornamos a mesma mensagem para evitar enumeração de usuários
    res.status(200).json({ 
      success: true, 
      message: 'Se o email existir em nossa base, você receberá instruções para redefinir sua senha'
    });
  } catch (error) {
    console.error('Erro no reset de senha:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};
