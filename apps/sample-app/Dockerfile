# Stage 1: The "Kitchen" (Build Environment)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# If you had a build step (like React or TypeScript), you'd run it here
# RUN npm run build 

# Stage 2: The "Dining Room" (Production Runtime)
FROM node:18-alpine AS runner
WORKDIR /app

# We ONLY copy the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app.js ./
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "app.js"]