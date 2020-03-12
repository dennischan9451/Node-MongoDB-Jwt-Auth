FROM node:10

WORKDIR /home/webapp-backend
COPY . .

RUN npm install

CMD npm start
