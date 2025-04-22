import bcrypt from 'bcryptjs';

/**
 * Gera um hash seguro para uma senha
 * @param password - Senha em texto plano
 * @returns Hash da senha
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Verifica se uma senha em texto plano corresponde a um hash
 * @param password - Senha em texto plano
 * @param hashedPassword - Hash da senha armazenada
 * @returns true se a senha corresponder ao hash, false caso contrário
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Verifica força da senha
 * @param password - Senha em texto plano
 * @returns Objeto com resultado da validação
 */
export const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }
  
  // Adicione mais regras de validação conforme necessário
  
  return { valid: true };
};
