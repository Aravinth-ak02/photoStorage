FROM node:18-alpine
# Create app directory
WORKDIR /usr/application
# Install app dependencies
COPY package*.json ./

RUN npm i
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 5173
# CMD [ "npm", "run" , 'dev' ]
CMD npm run dev