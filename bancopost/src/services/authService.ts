import User from '../models/User';
import validator from 'validator';

interface AuthResult {
  success: boolean;
  message: string;
  user?: any;
}

// Serviço para login de usuário
export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    // Validação de email
    if (!validator.isEmail(email)) {
      return { success: false, message: 'Email inválido' };
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    
    // Verificar se a senha está correta
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    
    // Preparar objeto de usuário para retornar (sem a senha)
    const userJson = user.toJSON();
    const { password: _, ...userWithoutPassword } = userJson;
    
    return { 
      success: true, 
      message: 'Login bem-sucedido',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Erro no serviço de login:', error);
    return { success: false, message: 'Erro ao processar login' };
  }
};

// Serviço para registro de usuário
export const registerUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
  try {
    // Verificar se já existe um usuário com esse email
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return { success: false, message: 'Email já está em uso' };
    }
    
    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Preparar objeto de usuário para retornar (sem a senha)
    const userJson = user.toJSON();
    const { password: _, ...userWithoutPassword } = userJson;
    
    return {
      success: true,
      message: 'Usuário registrado com sucesso',
      user: userWithoutPassword
    };
  } catch (error: any) {
    console.error('Erro no serviço de registro:', error);
    
    // Tratamento específico para erros de validação Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message);
      return { success: false, message: messages.join('; ') };
    }
    
    return { success: false, message: 'Erro ao registrar usuário' };
  }
};

// Serviço para iniciar processo de reset de senha
export const initiatePasswordReset = async (email: string): Promise<AuthResult> => {
  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Por razões de segurança, não informamos se o email existe ou não
      return { success: true, message: 'Processo iniciado' };
    }
    
    // Aqui você implementaria a lógica para enviar email de reset
    // Por enquanto, apenas simulamos o processo com sucesso
    
    return {
      success: true,
      message: 'Email de recuperação enviado'
    };
  } catch (error) {
    console.error('Erro no serviço de reset de senha:', error);
    return { success: false, message: 'Erro ao processar solicitação' };
  }
};
