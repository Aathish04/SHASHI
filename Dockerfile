# Use the node:slim image
FROM node:slim

RUN apt update
RUN apt install -y wget

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

# Download the model specified at models/source.txt unless it already exists (from copying it over)
RUN wget -nc -O models/model.gguf $(head -n 1 models/source.txt);[ $? -eq 0 ] || [ $? -eq 1 ] && exit 0 || exit $?

# Install the project 
RUN npm install

# Run the bot.
CMD ["node", "bot.js"]