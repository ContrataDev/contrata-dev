FROM node:25.1.0-alpine
WORKDIR /usr/src/contrata-dev

COPY package*.json ./
RUN npm install --no-package-lock

COPY . .

EXPOSE 3000

CMD [ "node", "bin/www" ]
