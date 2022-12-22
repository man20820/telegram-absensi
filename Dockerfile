FROM node:16.17

WORKDIR /usr/src/app
COPY . .
RUN npm install --prod
EXPOSE 3000
CMD [ "node", "./index.js" ]