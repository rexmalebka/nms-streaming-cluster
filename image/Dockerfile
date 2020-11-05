FROM jrottenberg/ffmpeg 

WORKDIR /usr/src/streaming-server

RUN apt-get update -y
RUN apt-get install curl -y
RUN curl https://deb.nodesource.com/setup_15.x > /tmp/setup.sh
RUN sh /tmp/setup.sh
RUN apt-get install -y nodejs

COPY app/package*.json ./
COPY app/server.js ./
RUN npm install
EXPOSE 1935
ENTRYPOINT [""]
#CMD ["node", "server.js"]
CMD ["node","server.js"]

