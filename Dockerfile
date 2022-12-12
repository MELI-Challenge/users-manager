ARG PROD_NODE_MODULES_PATH=/tmp/prod_node_modules

FROM node:18-alpine3.15 as base
WORKDIR /root/app


FROM base as dependencies
ARG PROD_NODE_MODULES_PATH
COPY package*.json ./
RUN npm install --only=production --loglevel verbose
RUN cp -R node_modules "${PROD_NODE_MODULES_PATH}"
RUN npm install

FROM dependencies as build
COPY . .

RUN npm run build

FROM build AS test
RUN  npm run test
RUN  npm run coverage

FROM base as release
ARG PROD_NODE_MODULES_PATH

COPY ./build .
COPY --from=dependencies "${PROD_NODE_MODULES_PATH}" ./node_modules

EXPOSE 4100

ENV PORT=4100

CMD npm run start