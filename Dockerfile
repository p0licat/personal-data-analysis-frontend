FROM node:latest
RUN mkdir -p /code
WORKDIR /code
ADD . /code
COPY package.json ./
RUN yarn install --ignore-engines
RUN yarn run build
CMD ["yarn", "start"]