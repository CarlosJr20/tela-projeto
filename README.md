# Sistema de Autenticação Simplificado

Este é um sistema de autenticação simplificado construído com Next.js e React.

## Funcionalidades

- Tela de login
- Tela de cadastro
- Recuperação de senha
- Dashboard protegido

## Tecnologias Utilizadas

- Next.js
- React
- Tailwind CSS
- Shadcn/UI (componentes)
- Axios para chamadas de API

## Configuração da API

O sistema está configurado para se conectar a uma API em `http://localhost:5000/api/auth`. Certifique-se de que sua API esteja rodando neste endereço ou atualize o arquivo `services/auth-service.ts` com o endereço correto.

A API deve fornecer os seguintes endpoints:
- POST /api/auth/login - Para autenticação de usuários
- POST /api/auth/register - Para registro de novos usuários
- POST /api/auth/reset-password - Para solicitação de redefinição de senha

## Executando o projeto

\`\`\`bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
\`\`\`

O projeto estará disponível em http://localhost:3000
