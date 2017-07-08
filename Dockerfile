FROM node:boron

RUN mkdir -p /srv/demo
WORKDIR /srv/demo
COPY . /srv/demo
RUN npm install
CMD [ "npm", "start" ]
