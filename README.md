# 🔥 SparkMail

> Transform Emails Into Productivity Powerhouses Instantly

[![TypeScript](https://img.shields.io/badge/TypeScript-66.2%25-blue)](https://github.com/yourusername/sparkmail)
[![Python](https://img.shields.io/badge/Python-Backend-green)](https://github.com/yourusername/sparkmail)
[![FastAPI](https://img.shields.io/badge/FastAPI-Framework-009688)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB)](https://reactjs.org/)

SparkMail é uma solução inteligente de classificação e resposta automática de emails, desenvolvida para otimizar o fluxo de trabalho de equipes que lidam com alto volume de mensagens diárias. Utilizando inteligência artificial avançada, o sistema categoriza emails e sugere respostas contextualizadas automaticamente.

## Deploy:

> IMPORTANTE: o deploy da api foi feito em uma instância gratuita, o que pode gerar uma lentidão na primeira requisição de 50s ou mais.

  - Frontend: [https://spark-mail.vercel.app/](https://spark-mail.vercel.app/)
  - Backend: [https://sparkmail-1.onrender.com](https://sparkmail-1.onrender.com)
  - Docs: [https://sparkmail-1.onrender.com/docs](https://sparkmail-1.onrender.com/docs)


## Case Prático - AutoU

Este projeto foi desenvolvido como solução para o desafio técnico da AutoU, focando em:

- ✅ Classificação automática de emails (Produtivo vs Improdutivo)
- ✅ Geração inteligente de respostas contextualizadas
- ✅ Interface web moderna e intuitiva
- ✅ Deploy em produção com acesso público
- ✅ Arquitetura escalável e bem documentada

## Funcionalidades

### Classificação Inteligente
- **Produtivo**: Emails que requerem ação (suporte técnico, atualizações, dúvidas)
- **Improdutivo**: Mensagens sem urgência (felicitações, agradecimentos)

### IA Avançada
- Processamento de linguagem natural (NLP)
- Análise contextual profunda
- Geração de respostas personalizadas
- Integração com OpenAI GPT

### Múltiplos Formatos
- Upload de arquivos `.txt` e `.pdf`
- Inserção direta de texto

### Interface Moderna
- Design responsivo e intuitivo
- Dark mode / Light mode
- Feedback visual em tempo real
- Experiência fluída e profissional

## Stack

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Shadcn UI** - Componentes acessíveis
- **Axios** - HTTP client

### Backend
- **Python 3.11** - Linguagem core
- **FastAPI** - Framework web
- **OpenAI API** - Inteligência artificial
- **PyPDF2** - Processamento de PDFs
- **Uvicorn** - ASGI server

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **ESLint + Prettier** - Code quality
- **Husky** - Git hooks
- **Lint-Staged** -- pre-commit

## Instalação e Execução

### Pré-requisitos
- Node.js 20+
- Python 3.11+
- Docker e Docker Compose
- Conta OpenAI com API key

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/yourusername/sparkmail.git
cd sparkmail
```

### 2️⃣ Configure as Variáveis de Ambiente

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Adicione sua OPENAI_API_KEY no arquivo .env
```

**Frontend (.env)**
```bash
cd frontend
cp .env.example .env
# Configure VITE_API_URL=http://localhost:8000
```

### 3️⃣ Executar com Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up --build
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentação API: http://localhost:8000/docs

### 4️⃣ Executar Localmente (Desenvolvimento)

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
