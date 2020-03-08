FROM mhart/alpine-node:10

WORKDIR /app

# Make one layer for package dependencies - recreating this layer is expensive, so we should avoid doing it
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Build and then trim out the devDependencies from node_modules
RUN yarn build \
  && yarn install --production

FROM node
RUN apk add --no-cache curl

WORKDIR /app

RUN rm -f .yarnrc .npmrc

# Copy workspace from the builder
WORKDIR /app
COPY --from=builder /app .

VOLUME ["/conf.d", "/mnt/logs"]

CMD ["./start.sh"]