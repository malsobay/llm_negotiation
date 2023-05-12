// @ts-check
import React, { useMemo } from "react";
import { ChatCommon } from "./ChatCommon";
import { randID } from "./utils";
import useGameMechanics from "./useGameMechanics";

export function ChatWithHuman({ game, player, players, stage, round }) {
  const { playerId, otherPlayerId, messages, setMessages, switchTurns } =
    useGameMechanics();

  const onNewMessage = async (newMessageText) => {
    const text = newMessageText.trim();

    if (text.length === 0) {
      return;
    }

    try {
      /** @type {import("./useGameMechanics").Message} */
      const newMessage = {
        type: "message",
        text,
        playerId,
        gamePhase: `Round ${round.index} - ${stage.name}`,
        id: randID(),
        timestamp: Date.now(),
        agentType: "user",
      };

      const messagesWithUserMessage = [...messages, newMessage];
      setMessages(messagesWithUserMessage);
      switchTurns();
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <ChatCommon
      game={game}
      player={player}
      players={players}
      round={round}
      stage={stage}
      onNewMessage={onNewMessage}
    />
  );
}
