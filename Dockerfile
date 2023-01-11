FROM node:13

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

ADD disco-outpost-294920.json /var/credentials/

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
