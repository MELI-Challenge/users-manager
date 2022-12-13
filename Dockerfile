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

FROM build as release
ARG PROD_NODE_MODULES_PATH

COPY --from=build /root/app/build .
COPY --from=dependencies "${PROD_NODE_MODULES_PATH}" ./node_modules

EXPOSE 4100

ENV PORT=4100

ENTRYPOINT ["npm","run","start"]