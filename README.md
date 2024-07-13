# my-craft-ai

This is my reproduction of [Neal.fun InfiniteCraft](https://neal.fun/infinite-craft/).

Right now, I only made the backend. The frontend is still in progress.

I used Bun, KeyDB and MongoDB to have a easy and really fast backend to handle the requests. (+ OpenAI API to generate the craft elements).

This is only a personal project to learn more about the technologies and have fun. It should not be used for any production purposes.

## Some notes

- The OpenAI API is not free. You need to have an API key to use it.
- I tried several models, OpenAI win the battle by far versus all Anthropic models. (Yes, even the last 3.5. I don't know why, but the results were really bad. Everytime I said I only want JSON, it want to speak).
- OpenAI work great for a prototype, but I think we could use a more specific model to have better results. (and faster). Maybe fine-tuning a model with the data from the game or use a smaller model.
- Local model would be really cool, but I need to set up a lot of things to make it work. (I'm not sure if it's worth it + fml).

## How to run

### Requirements

- Docker
- Docker Compose

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
```

### Running

```bash
docker-compose up
```

### Stopping

```bash
docker-compose down
```

### Running tests

Fuck it
