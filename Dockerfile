FROM node:10.2.0

LABEL maintainer="oshalygin@gmail.com"
LABEL description="La Voter App"

ENV PORT=8080

COPY . /wwwroot
WORKDIR /wwwroot

EXPOSE 8080

RUN npm install
RUN npm run build

ENTRYPOINT  ["npm ", "run", "production"]
