import {
    Slider,
    usePlayer,
    usePlayers,
    useStage,
    useGame,
    useRound
  } from "@empirica/core/player/classic/react";

  import React from "react";
  import { ChatView } from "./Chat";
  import { Avatar } from "./components/Avatar";


export function LLM() {
    const player = usePlayer();
    const players = usePlayers();
    const stage = useStage();
    const game = useGame();
    const round = useRound();

    return (
      <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
        <ChatView game={game} player={player} stage={stage} round={round}/>        
      </div>
    );
  }