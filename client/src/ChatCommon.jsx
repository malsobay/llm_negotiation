// @ts-check
import React, { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import { randID } from "./utils";

export function ChatCommon({
  game,
  player,
  round,
  stage,
  onNewMessage: onNewMessageImpl,
  onNewNoDeal: onNewNoDealImpl = undefined,
  onNewProposal: onNewProposalImpl = undefined,
  playerId,
  otherPlayerId,
}) {
  const [busy, setBusy] = useState(false);
  const messages = game.get("messages") || [];

  const onNewMessage = async (newMessage) => {
    setBusy(true);
    await onNewMessageImpl(newMessage);
    setBusy(false);
  };

  const onAccept = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "proposal") {
        lastMessage.proposalStatus = "accepted";
        game.set("messages", [...messages]);

        // We might want to save this data to a stage or a round instead if the game can have multiple rounds
        game.set("result", "deal-reached");
        game.set("price", lastMessage.proposal);
        player.stage.set("submit", true);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onReject = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "proposal") {
        lastMessage.proposalStatus = "rejected";
        game.set("messages", [...messages]);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onEnd = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "no-deal") {
        lastMessage.noDealStatus = "ended";
        game.set("messages", [...messages]);

        // We might want to save this data to a stage or a round instead if the game can have multiple rounds
        game.set("result", "no-deal");
        player.stage.set("submit", true);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onContinue = async () => {
    setBusy(true);

    try {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "no-deal") {
        lastMessage.noDealStatus = "continued";
        game.set("messages", [...messages]);
      }
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onNewNoDeal = async () => {
    setBusy(true);

    try {
      game.set("messages", [
        ...messages,
        {
          type: "no-deal",
          noDealStatus: "pending",
          playerId,
          text: "",
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "user",
        },
      ]);
      game.set("currentTurnPlayerId", otherPlayerId);

      onNewNoDealImpl();
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const onNewProposal = async (proposal) => {
    setBusy(true);

    try {
      game.set("messages", [
        ...messages,
        {
          type: "proposal",
          proposal,
          proposalStatus: "pending",
          playerId,
          gamePhase: `Round ${round.index} - ${stage.name}`,
          id: randID(),
          timestamp: Date.now(),
          agentType: "user",
        },
      ]);
      game.set("currentTurnPlayerId", otherPlayerId);

      onNewProposalImpl(proposal);
    } catch (err) {
      console.error(err);
      return;
    }

    setBusy(false);
  };

  const hasProposalPending =
    messages[messages.length - 1]?.proposalStatus === "pending";
  const hasNoDealPending =
    messages[messages.length - 1]?.noDealStatus === "pending";

  const hasProposalAccepted =
    messages[messages.length - 1]?.proposalStatus === "accepted";

  const hasNoDealEnded =
    messages[messages.length - 1]?.noDealStatus === "ended";

  const chatEnded = hasProposalAccepted || hasNoDealEnded;

  const stageSubmitted = player.stage.get("submit");

  // This will submit the local player stage if the chat has ended by any of the players
  useEffect(() => {
    if (!stageSubmitted && chatEnded) {
      player.stage.set("submit", true);
    }
  }, [stageSubmitted, chatEnded]);

  const waitingOnOtherPlayer = game.get("currentTurnPlayerId") !== player.id;

  return (
    <div
      className="overflow-y-auto h-full w-full max-w-screen-lg mx-auto"
      style={{ maxHeight: "80vh" }}
    >
      <Chat
        busy={busy || stageSubmitted || waitingOnOtherPlayer}
        messages={messages}
        playerId={playerId}
        instructions={player.get("instructions")}
        onNewMessage={onNewMessage}
        onNewNoDeal={onNewNoDeal}
        onNewProposal={onNewProposal}
        onAccept={
          !waitingOnOtherPlayer && hasProposalPending ? onAccept : undefined
        }
        onReject={
          !waitingOnOtherPlayer && hasProposalPending ? onReject : undefined
        }
        onEnd={!waitingOnOtherPlayer && hasNoDealPending ? onEnd : undefined}
        onContinue={
          !waitingOnOtherPlayer && hasNoDealPending ? onContinue : undefined
        }
        waitingOnOtherPlayer={waitingOnOtherPlayer}
      />
    </div>
  );
}
