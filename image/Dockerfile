FROM jrottenberg/ffmpeg 

WORKDIR /usr/src/streaming-server

RUN apt-get update -y
RUN apt-get install curl -y
RUN curl https://deb.nodesource.com/setup_15.x > /tmp/setup.sh
RUN sh /tmp/setup.sh
RUN apt-get install -y nodejs

COPY ./app/tsconfig.json .
COPY ./app/package*.json .
COPY ./app/src src
RUN npm install
RUN ls
RUN npm run build

EXPOSE 1935
#CMD ["node", "server.js"]
ENTRYPOINT ["/usr/bin/env"]
CMD ["npm","run", "start"]
