# Build with `docker build -t shashibot:latest -f SHASHIBot.Dockerfile .`

# Use the node:slim image
FROM node:slim

USER node

# Set home to the user's home directory
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH

# Set the working directory to /home/node
WORKDIR /home/node

# Copy the current directory contents into the container at /home/node/shashi
COPY --chown=node:node . /home/node/shashi/

# Set current working directory to /home/node/shashi
WORKDIR /home/node/shashi

# Install the project 
RUN npm install

# Run the bot.
ENTRYPOINT ["node", "bot.js"]