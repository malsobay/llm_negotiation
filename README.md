# llm_negotiation
Code to run an experiment with LLMs for negotiation in Empirica. 

# Getting started:
1. Clone the repo, then run `npm install` within the main directory and each of the `client` and `server` directories. 
2. Add a `.env.local` file to the `client` directory containing the following:.
```
VITE_CHAT_API_PORT="5000"
```
3. Add a `.env` file to the `server` directory containing the following and replacing `<YOUR_OPENAI_KEY>` with your OpenAI API key:
```
OPENAI_API_KEY="<YOUR_OPENAI_KEY>"
CHAT_API_PORT="5000"
```
4. From the main directory, run the command `empirica`. 
5. Go to `http://localhost:3000/admin` in your browser to access the admin console, create a treatment from the factors already defined, and create a batch to negotiate with an LLM. 

# Running experiments

There are two types of experiments that can be run: Human-vs-Human and LLL-vs-Human. This is controlled by the `playerCount` factor, the value of `1` means that the human player is playing against an LLM, and the value of `2` means a human multiplayer game.

## Human-vs-Human game treatment
1. Set `playerCount` to 2
2. Set `firstPlayerInstructions` and `secondPlayerInstructions`

## LLL-vs-Human game treatment
1. Set `playerCount` to 1
2. Set `firstPlayerInstructions`, these are the instructions for the human player
3. Set `llmPrompt`, `llmPromptRole`, `llmDemeanor` and `llmTemperature` -- all factors are required

## Getting the result of the game
Results of the game are saved on the game object after it ends.

When the game ends with a deal:
* `result` will be equal to `deal-reached`
* `proposal` will contain the agreed upon offer

When the game ends with no deal:
* `result` will be equal to `no-deal`

When the game ends on timeout:
* No `result` attribute will be present

# Notes:
We should NEVER commit the `.env` files (they're in `.gitignore`)

# To-do: 
* Clean up the init process when cloning this repo -- there's probably a cleaner way, and if there isn't, we should just have one bash script that does all we need. 
