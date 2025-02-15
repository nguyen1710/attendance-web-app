# Sử dụng Node.js 23.2.0
FROM node:23

# Set working directory
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cài đặt dependencies
RUN npm install

# Expose cổng tương ứng
EXPOSE 3002

# Chạy server
CMD ["node", "index.js"]