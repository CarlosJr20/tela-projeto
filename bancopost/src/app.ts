import taskRoutes from './routes/taskRoutes'
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import { connectDB, sequelize } from './config/db';

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do app Express
const app: Application = express();

// Conectar ao PostgreSQL
connectDB()
  .then(() => {
    // Sincronizar os modelos com o banco de dados
    return sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
  })
  .then(() => {
    console.log('✅ Modelos sincronizados com o banco de dados');
  })
  .catch((err) => {
    console.error('❌ Erro ao sincronizar modelos:', err);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


// Rota de teste básica
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de autenticação funcionando!' });
});

// Middleware para rotas não encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});


export default app;
