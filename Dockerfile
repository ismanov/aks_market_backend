FROM node:14

RUN npm i -g @nestjs/cli

COPY package.json .

RUN npm install

COPY . .

COPY /../env/config.toml /config

EXPOSE 6010

CMD ["npm","run", "start:dockerDev"]