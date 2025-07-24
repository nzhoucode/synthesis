FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /frontend
COPY package*.json ./
COPY . .
RUN npm install 
RUN npm install -g serve
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]