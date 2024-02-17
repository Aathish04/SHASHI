# SHASHI - SSN's High-Alert Security Hotline Intern

Shashi is a Discord Bot built for (and by!) the SSN Coding and Cybersecurity Clubs to demonstrate LLM Security Concepts such as Prompt Injection and Social Engineering.

[Join the SSN Coding Club Discord Server](https://discord.gg/uqUYYwnYFx) to interact with Shashi!

[Join the SSN Cybersecurity Club Discord Server](https://discord.gg/8YzBWBvCCS) to help beta-test new features of Shashi!

## Features
- Fluid chat system invoked by `@mention`-ing the bot.
- Server->Channel->User specific message history/context backed up to Firebase.
- Utility command to clear current Server->Channel->User specific chat context/history.
- Automagically splits non-code messages longer than 2000 characters into smaller messages.
- Interfaces with any OpenAI API Compatible LLM inference Server.
    - [x] Tested with [llama-cpp-python's web server](https://github.com/abetlen/llama-cpp-python?tab=readme-ov-file#openai-compatible-web-server).
    - [x] Tested with [Gemini-OpenAI-Proxy](https://github.com/zuisong/gemini-openai-proxy)

## Deployment

Shashi Consists of two distinct parts:
- The Discord Bot itself
- The LLM language server the Bot uses to generate text.

You can deploy the bot both with and without Docker, but using Docker is encouraged, since it really makes deployment much, MUCH simpler.

Skip [here](#deploying-with-docker) for details on using Docker to deploy.

### Deploying without Docker
Deployment generally consists of 4(+1=5) steps:

#### 0) Cloning this repository to your computer

#### 1) Ensuring a running OpenAI Compatible LLM Server.

Common choices include the servers provided by [llama.cpp](https://github.com/ggerganov/llama.cpp), [llama-cpp-python](https://github.com/abetlen/llama-cpp-python?tab=readme-ov-file#openai-compatible-web-server) or [vllm](https://github.com/vllm-project/vllm). Follow the respective documentation, and if you have compatible GPU hardware, be sure to follow the specific instructions that take advantage of your hardware.

#### 2) Setting The Proper Environment Variables

Ensure your environment variables are properly set. You can look at the `sample.env` file to know what variables have to be set. You must rename the file to `.env` after setting all the environment variables for the bot to make use of them.

#### 3) Installing the Discord Bot

Run `npm install` in the directory where this file is to install all of the dependencies required and the bot itself.

#### 4) Running the Discord Bot

Run `node bot.js` to run the Discord Bot.

### Deploying With Docker

Deployment generally consists of three steps:

#### 1) Ensuring a running OpenAI Compatible LLM Server.

Follow whatever steps are documented for running an OpenAI compatible dockerized LLM Web server for the LLM Web server you choose.

> The included [`SHASHILLM.Dockerfile`](SHASHILLM.Dockerfile) file has been written for Dockerized deployment of an LLM server on a Linux system with an NVidia GPU (it's based on the default [`llama-cpp-python` `cuda_simple` Dockerfile](https://github.com/abetlen/llama-cpp-python/blob/main/docker/cuda_simple/Dockerfile) ) - feel free to make use of it if you're running on similar Hardware.
To build the docker container, run `docker build -t shashillm:latest . -f SHASHILLM.Dockerfile`, and use the provided `sample_compose.yaml` to run the server and the bot using docker compose.

> If you want to use Google's Gemini as the LLM backend, you must make use of the  `gemini-openai-proxy` service included in the `sample_compose.yaml` file. 

If you're not Dockerizing the LLM server itself, make sure the Dockerized bot can access the server (running on the Host system) from inside the container. Generally, the Host system can be accessed through the special hostname `http://host.docker.internal:8000`.

#### 2) Build the Bot's Docker Image

Run `docker build -t shashibot:latest . -f SHASHIBot.Dockerfile`.

#### 3) Using Docker Compose to run both the Server and the Bot (or just the Bot)

Firstly, fill in all the environment variables that have been left blank in the `sample.env` file and rename the file `.env`.

Then, modify the `sample_compose.yaml` to your liking and rename the `sample_compose.yaml` file to `compose.yaml`.

Then, simply run `docker compose up bot`.

To also run the local inference server, you should run `docker compose up local_llm`

If you're using Gemini and have a suitable API key:

`docker compose up gemini-openai-proxy`

Make sure your environment variables are properly set (either in the `.env` file, or in the `compose.yaml` file).

To run all three services at the same time:

`docker compose up bot local_llm gemini-openai-proxy`

If you want to run these processes in the background, you should used detached mode:

`docker compose up -d bot local_llm gemini-openai-proxy`

To stop running one or more of the processes:

`docker compose stop bot local_llm`

To restart a stopped process:

`docker compose start bot local_llm`

## Contribution
Is welcome! If you have an issue to report, please report it on the Issues tab of the project GitHub repository.

If you would like to add features or fix bugs, you are encouraged to fork this repository and make a pull-request.
