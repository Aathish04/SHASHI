# Use the official Python 3.9 image
FROM node:slim

USER node

# Set home to the user's home directory
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH

# Set the working directory to /code
WORKDIR /home/node

# Copy the current directory contents into the container at /code
COPY --chown=node:node . /home/node/shashi/

WORKDIR /home/node/shashi
# Install requirements.txt 
RUN npm install

CMD ["node", "bot.js"]