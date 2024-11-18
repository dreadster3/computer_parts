FROM node:alpine AS base
ARG IMAGE_PROCESSOR_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV VITE_IMAGE_PROCESSOR_URL=$IMAGE_PROCESSOR_URL
RUN corepack enable
WORKDIR /app
COPY . .

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

RUN pnpm install -g serve

EXPOSE 3000


CMD [ "serve", "-s", "dist" ]
