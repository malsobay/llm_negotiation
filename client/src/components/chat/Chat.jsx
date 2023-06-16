// @ts-check
import React, { useState } from "react";
import { Timer } from "../Timer";
import { DealArea } from "./Deals";
import { InputBox } from "./Input";
import { Instructions } from "./Instructions";
import { Messages } from "./Messages";

export function Chat({
  messages,
  playerId,
  instructions,
  onNewMessage,
  onNewProposal,
  onNewNoDeal,
  busy,
  waitingOnOtherPlayer,
  otherPlayerId,
  otherPlayerTyping,
  onAccept,
  onReject,
  onEnd,
  onContinue,
}) {
  const [inputMode, setInputMode] = useState("message");

  const waitingOnProposal = !!onAccept || !!onReject;
  const waitingOnNoDeal = !!onEnd || !!onContinue;

  const placeholder = getPlaceholder({
    waitingOnProposal,
    waitingOnNoDeal,
    waitingOnOtherPlayer,
  });

  return (
    <div className="grid h-full w-full auto-cols-auto grid-flow-col grid-rows-1 items-start items-center justify-center gap-x-8 overflow-hidden px-8">
      <div className="lt-lg:bottom-0 absolute w-full text-center lg:top-0">
        <div className="lt-lg:mb-2 inline-block px-4 py-1 lg:mt-2">
          <Timer />
        </div>
      </div>

      <div className="grid max-h-full grid-rows-[1fr_92px_48px] overflow-hidden">
        <div className="flex max-w-prose flex-col justify-between gap-y-8 overflow-hidden">
          <Messages
            messages={messages}
            currentPlayerId={playerId}
            typingPlayerId={otherPlayerTyping ? otherPlayerId : undefined}
          />

          <InputBox
            playerId={playerId}
            onNewMessage={onNewMessage}
            disabled={
              busy ||
              waitingOnOtherPlayer ||
              waitingOnNoDeal ||
              waitingOnProposal ||
              inputMode !== "message"
            }
            placeholder={placeholder}
          />
        </div>

        <DealArea
          waitingOnOtherPlayer={waitingOnOtherPlayer}
          waitingOnNoDeal={waitingOnNoDeal}
          waitingOnProposal={waitingOnProposal}
          inputMode={inputMode}
          onNewProposal={onNewProposal}
          setInputMode={setInputMode}
          messages={messages}
          onNewNoDeal={onNewNoDeal}
          onAccept={onAccept}
          onReject={onReject}
          onContinue={onContinue}
          onEnd={onEnd}
        />

        <div className="flex justify-center pt-1">
          <Instructions instructions={instructions} />
        </div>
      </div>
    </div>
  );
}

function getPlaceholder({
  waitingOnProposal,
  waitingOnNoDeal,
  waitingOnOtherPlayer,
}) {
  if (!waitingOnOtherPlayer && waitingOnProposal) {
    return "Deal or no deal?";
  } else if (waitingOnNoDeal) {
    return "Continue or end it?";
  } else if (waitingOnOtherPlayer) {
    return "Waiting for Opponent...";
  }

  return "Negotiate...";
}
