import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import instructions from "./instructions";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");

  const {
    firstPlayerInstructions: firstPlayerInstructionsShort,
    secondPlayerInstructions: secondPlayerInstructionsShort,
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
  round.addStage({ name: "Negotiation", duration: 3600 });

  let currentTurnPlayerId;

  if (multiplayer) {
    game.players[0].set("instructions", firstPlayerInstructions);
    game.players[1].set("instructions", secondPlayerInstructions);
    currentTurnPlayerId = game.players[0].id;
  } else {
    if (llmStartsFirst) {
      game.players[0].set("llmInstructions", firstPlayerInstructions);
      game.players[0].set("instructions", secondPlayerInstructions);
      currentTurnPlayerId = `${game.players[0].id}-assistant`;
    } else {
      game.players[0].set("instructions", firstPlayerInstructions);
      game.players[0].set("llmInstructions", secondPlayerInstructions);
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
