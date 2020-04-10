FROM node:alpine
RUN apk add make python gcc g++
RUN adduser -S placehodor
USER placehodor
WORKDIR /home/placehodor
COPY --chown=placehodor:nogroup ./ ./
RUN yarn install
RUN make
ENV HOSTNAME="0.0.0.0"
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["yarn", "start"]
