FROM denoland/deno:1.38.3
ARG VERSION
ENV DENO_DEPLOYMENT_ID=${VERSION}

WORKDIR /app

COPY . .
RUN deno cache --reload main.ts

EXPOSE 8000

CMD ["run", "-A", "--unstable", "main.ts"]