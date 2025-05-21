# Sử dụng một stage duy nhất cho cả build và production
FROM node:20-alpine

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy tất cả các file
COPY . .

# Build ứng dụng
RUN npm run build

# Expose port 5173 (đúng với cấu hình trong docker-compose)
EXPOSE 5173

# Chạy ứng dụng
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
