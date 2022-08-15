
# https://docs.docker.com/engine/reference/builder/
#
# Build with
# docker build . -f Dockerfile -t <local-image-name>
#
# Tag with (remember to push at least 1 latest tag)
# docker tag <local-image-name>:tagname liuyajie728/<image-name>:tagname 
#
# Push with
# docker push liuyajie728/<local-image-name>:tag-name
#
# Pull with
# docker pull liuyajie728/<local-image-name>:tag-name
#
# Scan (for safety) with
# docker scan <local-image-name>
#
# Export with
# docker save <local-image-name> -o <local-image-name>.tar
#
# Load with
# docker load -i <local-image-name>.tar
#
# Run with
# docker container run --name <local-image-name> -d -p 3000:3000 <container-name>
FROM node:18-slim
LABEL maintainer="Kamas Lau<kamaslau@dingtalk.com>"

# Install some tools for test only.
# RUN \
#   apt-get update && \
#   apt-get install -y --no-install-recommends \
#   nano net-tools

WORKDIR /root/app

COPY src ./src/
COPY .env_template ./.env
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm@latest && \
  pnpm i

EXPOSE 3000

CMD pnpm start
