FROM node:alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .


FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm install typescript

RUN pnpm run build


FROM base
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

RUN npm i -g serve

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
