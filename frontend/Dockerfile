FROM node:13.12.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
RUN yarn install
COPY . /app
EXPOSE 3000
CMD ["yarn", "run", "start"]

