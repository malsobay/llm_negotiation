import {
  useGame,
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { ChatWithHuman } from "./ChatWithHuman";
import { ChatWithLLM } from "./ChatWithLLM";
import { Introduction } from "./intro-exit/Introduction";
import { Instructions } from "./intro-exit/Instructions";

export function Stage() {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();
  const round = useRound();
  const stage = useStage();

  // if (player.stage.get("submit")) {
  //   if (players.length === 1) {
  //     return <Loading />;
  //   }

  //   return (
  //     <div className="pointer-events-none text-center text-gray-400">
  //       Please wait for other player(s).
  //     </div>
  //   );
  // }

  switch (stage.get("name")) {
    case "Instructions":
      return <Instructions />;
    case "Negotiation":
      switch (round.get("task")) {
        case "llm-vs-human":
          return (
            <ChatWithLLM
              game={game}
              player={player}
              players={players}
              round={round}
              stage={stage}
            />
          );
        case "human-vs-human":
          return (
            <ChatWithHuman
              game={game}
              player={player}
              players={players}
              round={round}
              stage={stage}
            />
          );
        default:
          return <div>Unknown task</div>;
      }
    default:
      break;
  }
}
