FROM denoland/deno:alpine-1.44.2

EXPOSE 8000

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno task build

ARG litestream_version="v0.3.13"
ARG litestream_binary_tgz_filename="litestream-${litestream_version}-linux-amd64.tar.gz"
ADD https://github.com/benbjohnson/litestream/releases/download/${litestream_version}/${litestream_binary_tgz_filename} /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

COPY litestream.yml /etc/litestream.yml

RUN apk add --no-cache bash

CMD [ "/app/scripts/serve.sh" ]
