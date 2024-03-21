FROM denoland/deno:alpine-1.41.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno cache main.ts
RUN deno task build

ARG litestream_version="v0.3.13"
ARG litestream_binary_tgz_filename="litestream-${litestream_version}-linux-amd64.tar.gz"
ADD https://github.com/benbjohnson/litestream/releases/download/${litestream_version}/${litestream_binary_tgz_filename} /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

RUN apk add --no-cache bash

COPY litestream.yml /etc/litestream.yml
COPY scripts/run.sh /app/run.sh

CMD [ "/app/run.sh" ]