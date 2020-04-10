FROM node:alpine
RUN apk add make
RUN useradd node
WORKDIR /home/node
USER node
COPY ./ ./
RUN yarn install
RUN make
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080
ENTRYPOINT ["yarn", "start"]
