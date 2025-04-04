# Use Node.js slim image for a balance of size & performance
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json into working directory
COPY package*.json ./

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Install dependencies --only=production
RUN npm install 

# Copy the rest of the app
COPY . .

# Expose port 3000 available outside the container
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
