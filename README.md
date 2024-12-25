# Lucaria

A platform for creating, sharing and solving quizzes using AI.

## Table of Contents

- [Introduction](#lucaria)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Docker](#docker)

## Introduction

Lucaria is an innovative platform designed to harness the power of artificial intelligence for creating, sharing, and solving quizzes. By leveraging advanced AI models, Lucaria can generate structured quizzes from a variety of user inputs, making it a versatile tool for educators, trainers, and quiz enthusiasts.

With Lucaria, users can:

- Create quizzes effortlessly using AI-generated questions.
- Share quizzes with others and track their performance.
- Solve quizzes created by others and receive instant feedback.

Whether you're looking to test your knowledge, create engaging learning experiences, or simply have fun, Lucaria provides the tools you need to make it happen.

## Requirements

This project uses Next.js 15 and React 19. In order to run it locally, make shure to have installed

- Nodejs `v22.9.0`
- pNpm `v9.7.0`

## Getting Started

Lucaria leverages the [LangChain](https://js.langchain.com/docs/introduction/) framework capabilities to consume [Large Language Models](https://en.wikipedia.org/wiki/Large_language_model) for generating structured quizzes from different kinds of user inputs.

To run, test and develop in your machine, it is necessary to have a model server available for the application.

If you followed the instructions to use [Docker] for the development environment, you already have a [Ollama](https://ollama.com/) container running. Otherwise, follow [these instructions](https://github.com/ollama/ollama) to run Ollama locally.

Now, in order to run the project in development mode, execute

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

To run the tests for the Lucaria project, you can use the scripts defined in the `package.json` file. Follow these steps:

1. Ensure you have all dependencies installed:

```bash
pnpm install
```

1. Run the tests:

```bash
pnpm test:unit
```

This will execute the test suite and provide you with the results in the terminal.

For coverage reports, run:

```bash
pnpm coverage
```

These commands will help you ensure that your code is functioning correctly and maintain high code quality.

## Docker

The repository includes a [Compose file](https://docs.docker.com/compose/) to set up a development environment using Docker. In order to use it, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.

1. Set the Compose file for the environment:

```bash
export COMPOSE_FILE=docker-compose.development.yml
```

1. Build and start the containers:

```bash
docker compose up --build
```

To stop the containers, run:

```bash
docker compose down
```
