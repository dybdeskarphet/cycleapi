FROM oven/bun:latest

WORKDIR /app
COPY package.json bun.lock tsconfig.json ./

RUN bun install

COPY . .

RUN bun run build

EXPOSE 8000

CMD ["bun", "run", "start"]
