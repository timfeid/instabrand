FROM node:16-alpine3.15

RUN apk add --no-cache \
    #   chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox.
# RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /app \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY yarn.lock .
COPY package.json .

RUN yarn install --network-timeout 100000 --pure-lockfile
# RUN cd ./node_modules/puppeteer && npm install

COPY . .

RUN mv .env.staging .env

RUN yarn prisma generate
RUN yarn build

# USER pptruser

CMD ["node", "dist/server.js"]
