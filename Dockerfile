FROM denoland/deno:1.38.3
ARG VERSION
ENV DENO_DEPLOYMENT_ID=${VERSION}

WORKDIR /app

COPY . .
RUN deno cache --reload main.ts
RUN deno task build
RUN deno run -A --unstable main.ts build

EXPOSE 8000

CMD ["run", "-A", "--unstable", "main.ts"]