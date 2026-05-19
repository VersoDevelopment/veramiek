FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
COPY admin.html .
RUN mkdir -p /app/data /app/uploads
EXPOSE 3001
CMD ["node", "server.js"]
