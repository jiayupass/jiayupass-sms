
# https://docs.docker.com/engine/reference/builder/
#
# Build with
# docker build . -t <local-image-name>
#
# Tag with (remember to push at least 1 latest tag)
# docker tag <local-image-name>:tagname <org-name>/<image-name>:tagname 
#
# Push with
# docker push <org-name>/<local-image-name>:tag-name
#
# Pull with
# docker pull <org-name>/<local-image-name>:tag-name
#
# Export with
# docker save <local-image-name> -o <local-image-name>.tar
#
# Load from file with
# docker load -i <local-image-name>.tar
#
# Run with
# docker container run --name <container-name> --restart always --add-host=host.docker.internal:host-gateway --privileged -d -p 3000:3000 <local-image-name>
FROM node:lts-slim
LABEL maintainer="Kamas Lau<kamaslau@dingtalk.com>"

# Install some tools for test only.
# RUN \
#   apt-get update && \
#   apt-get install -y --no-install-recommends \
#   nano net-tools

WORKDIR /root/app

COPY src ./src/
# COPY .env_template ./.env
COPY .env ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./

RUN npm i -g pnpm@latest && \
  pnpm i && \
  pnpm build

EXPOSE 3000

CMD pnpm start
