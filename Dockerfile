FROM denoland/deno:1.45.3

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /home/deno/denopaste

COPY . .
RUN deno fmt --check
RUN deno lint
RUN deno test
RUN deno task build

EXPOSE 8000/tcp
CMD [ "deno", "task", "preview" ]
