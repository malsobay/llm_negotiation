// @ts-check
import React, { useMemo } from "react";
import { ChatCommon } from "./ChatCommon";
import { randID } from "./utils";

export function ChatWithHuman({ game, player, players, stage, round }) {
  const messages = game.get("messages") || [];

  const playerId = player.id;
  const otherPlayerId = useMemo(
    () => players.find((p) => p.id !== playerId).id,
    [players]
  );

  const onNewMessage = async (newMessage) => {
    const text = newMessage.trim();

    if (text.length === 0) {
      return;
    }

    try {
      const messagesWithUserMessage = [
        ...messages,
        {
          type: "message",
          text,
          playerId,
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "user",
        },
      ];
      game.set("messages", messagesWithUserMessage);
      game.set("currentTurnPlayerId", otherPlayerId);
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <ChatCommon
      game={game}
      player={player}
      round={round}
      stage={stage}
      onNewMessage={onNewMessage}
      playerId={playerId}
      otherPlayerId={otherPlayerId}
    />
  );
}
