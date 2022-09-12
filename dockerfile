FROM node:16-alpine
ENV MONGO_DB_USERNAME=root MONGO_DB_PASSWORD=akshansh1998

RUN mkdir -p /home/app
COPY ./app /home/app
RUN cd /home/app && npm install


CMD ["node","/home/app"]
