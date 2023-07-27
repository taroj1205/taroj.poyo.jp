# Use the Node.js 14 base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY src/ ./src/

# Expose port 3000 (assuming your Next.js app listens on this port)
EXPOSE 3000

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]