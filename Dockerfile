ARG PROD_NODE_MODULES_PATH=/tmp/prod_node_modules

FROM node:18-alpine3.15 as base
USER node
WORKDIR /home/node

FROM base as dependencies
ARG PROD_NODE_MODULES_PATH
COPY --chown=node:node package*.json ./

RUN npm install --only=production
RUN cp -R node_modules "${PROD_NODE_MODULES_PATH}"
RUN npm install


FROM dependencies as build
#Splitting copy of source to ensure caching of npm_modules
COPY --chown=node:node . .
# download dev dependencies and perform build
ENV NODE_ENV production
RUN npm run build

FROM build as release
ARG PROD_NODE_MODULES_PATH

# RUN addgroup -S -g 10001 appGrp \
#     && adduser -S -D -u 10000 -s /sbin/nologin -h /home/node -G appGrp app
# USER 10000

COPY --chown=node:node --from=build /home/node/build .
COPY --chown=node:node --from=build "${PROD_NODE_MODULES_PATH}" ./node_modules

RUN ls -la
RUN pwd

EXPOSE 4100

ENV PORT=4100

ENTRYPOINT ["npm","run","start"]