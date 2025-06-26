# Use uma imagem base Node.js LTS (Long Term Support)
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e package-lock.json (se existir) para instalar as dependências
# Isso otimiza o cache do Docker, pois as dependências só serão reinstaladas se esses arquivos mudarem
COPY package*.json ./

# Instala as dependências de produção
RUN npm ci --only=production

# ==========================================================
# ADICIONE ESTA LINHA:
RUN npx prisma generate
# ==========================================================

# Copia o restante do código da aplicação para o contêiner
COPY . .

# Define o comando que será executado quando o contêiner iniciar
# Este é o seu comando de start do package.json
CMD ["node", "src/index.js"]

# Opcional: Expõe a porta que sua aplicação está escutando.
# Se sua API Express escuta na porta 3000, por exemplo, adicione:
EXPOSE 8000