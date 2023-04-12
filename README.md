# llm_negotiation
Code to run an experiment with LLMs for negotiation in Empirica. 

# Getting started:
1. Clone the repo, then run `npm install` within the main directory and each of the `client` and `server` directories. 
2. Add a `Constants.js` file to the `client/src` directory containing the following: `export const OPENAI_API_KEY = <YOUR API KEY>;`, replacing `<YOUR API KEY>` with your own. 
3. From the main directory, run the command `empirica`. 
4. Go to `http://localhost:3000/admin` in your browser to access the admin console, create a treatment from the factors already defined, and create a batch to negotiate with an LLM. 


# To-do: 
1. Clean up the init process when cloning this repo -- there's probably a cleaner way, and if there isn't, we should just have one bash script that does all we need. 
2. Set up API key management using `.env` and environment variables. We should NEVER commit the `Constants.js` file (it's in `.gitignore`) nor should we deploy with it in the `client` directory, but that's fine for now until we fix it. 
