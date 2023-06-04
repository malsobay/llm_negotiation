import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import instructions from "./instructions";
export const Empirica = new ClassicListenersCollector();

// If true, makes stages last a very long time.
const dev = false;

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");

  const {
    firstPlayerInstructions: firstPlayerInstructionsShort,
    secondPlayerInstructions: secondPlayerInstructionsShort,
    firstPlayerStatedOpponent,
    secondPlayerStatedOpponent,
    llmStartsFirst,
    playerCount,
  } = treatment;

  const firstPlayerInstructions = instructions[firstPlayerInstructionsShort];
  const secondPlayerInstructions = instructions[secondPlayerInstructionsShort];

  if (!firstPlayerInstructions || !secondPlayerInstructions) {
    throw new Error("Invalid instructions short code");
  }

  const multiplayer = playerCount === 2;

  const task = multiplayer ? "human-vs-human" : "llm-vs-human";

  const round = game.addRound({
    name: "Round 1",
    task,
  });
  round.addStage({ name: "Introduction", duration: dev ? 120000 : 120 });
  round.addStage({ name: "Instructions", duration: dev ? 120000 : 120 });
  round.addStage({ name: "Negotiation", duration: dev ? 360000 : 3600 });

  let currentTurnPlayerId;

  if (multiplayer) {
    game.players[0].set("instructions", firstPlayerInstructions);
    game.players[1].set("instructions", secondPlayerInstructions);
    game.players[0].set("statedOpponent", firstPlayerStatedOpponent);
    game.players[1].set("statedOpponent", secondPlayerStatedOpponent);
    currentTurnPlayerId = game.players[0].id;
  } else {
    if (llmStartsFirst) {
      game.players[0].set("llmInstructions", firstPlayerInstructions);
      game.players[0].set("llmStatedOpponent", firstPlayerStatedOpponent);
      game.players[0].set("instructions", secondPlayerInstructions);
      game.players[0].set("statedOpponent", secondPlayerStatedOpponent);
      currentTurnPlayerId = `${game.players[0].id}-assistant`;
    } else {
      game.players[0].set("instructions", firstPlayerInstructions);
      game.players[0].set("statedOpponent", firstPlayerStatedOpponent);
      game.players[0].set("llmInstructions", secondPlayerInstructions);
      game.players[0].set("llmStatedOpponent", secondPlayerStatedOpponent);
      currentTurnPlayerId = game.players[0].id;
    }
  }

  game.set("currentTurnPlayerId", currentTurnPlayerId);
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});
