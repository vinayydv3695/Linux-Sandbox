FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY linux-sandbox-5e1f3-firebase-adminsdk-fbsvc-ced475c009.json firebase-admin-key.json
COPY . .

CMD ["node", "backend.js"]
