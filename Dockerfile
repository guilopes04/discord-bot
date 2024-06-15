# Usa a imagem oficial do Node.js como base
FROM node:alpine

# Adiciona pacotes necessários para a instalação de dependências nativas
RUN apk add --no-cache python3 make g++

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/bot

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --production

# Copia todos os arquivos do diretório atual para o diretório de trabalho do contêiner
COPY . .

# Comando para iniciar o bot
CMD ["node", "src/index.js"]
