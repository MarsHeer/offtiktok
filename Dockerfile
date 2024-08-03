# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables
ENV NEXT_INTERNAL_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=http://localhost:2000
ENV GA_TRACING_ID=G-Y2K66L945V

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]