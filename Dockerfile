FROM node:lts-alpine3.17

ENV ALGO=sha256
ENV SECRET=secret

USER node

ENV HOME /usr/src/app
WORKDIR $HOME

COPY ["src/package.json", "src/yarn.lock", "$HOME/"]
RUN yarn install --frozen-lockfile --production

COPY ["./src", "$HOME/"]

EXPOSE 9000

CMD ["node", "index.js"]