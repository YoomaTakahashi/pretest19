FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm","-y","nodemon","-L","index.js" ]

# FROM node:20
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# CMD [ "npm","run","dev","--","--","host","0.0.0.0" ]