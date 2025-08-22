# Usar imagem leve do Node
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar restante do projeto
COPY . .

# Expor porta do Vite
EXPOSE 5173

# Rodar Vite em modo dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
