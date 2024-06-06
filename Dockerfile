FROM node:18-alpine
# Create app directory
WORKDIR /usr/app
# Install app dependencies
COPY package*.json ./

RUN npm ci
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8000
CMD [ "node", "index.js" ]