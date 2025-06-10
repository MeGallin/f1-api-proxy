# Multi-stage Docker build for F1 API Proxy
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS runtime

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S f1proxy -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=f1proxy:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown f1proxy:nodejs logs

# Switch to non-root user
USER f1proxy

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]