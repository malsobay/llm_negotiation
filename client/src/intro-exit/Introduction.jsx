import React from "react";
import { Button } from "../components/Button";
import { usePlayer } from "@empirica/core/player/classic/react";

export function Introduction() {
  const player = usePlayer();

  const next = () => {
    player.stage.set("submit", true);
  };

  const instructions = player.get("instructions");
  const statedOpponent = player.get("statedOpponent");

  return (
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-lg mx-auto">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instructions
      </h3>
      <div className="mt-2 mb-6 space-y-4">
        <p className="text-gray-700">
          In this task, you will be asked to participate in a negotiation with
          another party. You will receive a bonus compensation as high as $5
          based on how well you do on the negotiation (i.e., the price you are
          able to negotiate the table for) relative to other participants.
        </p>
        <p className="text-gray-700">
          Here are the instructions for this negotiation game:
        </p>
        <p className="text-gray-700 italic whitespace-pre-line break-words">
          {instructions}
        </p>
        <p className="text-gray-700">
          Please note that these instructions will always be accessible to you
          during the negotiation game.
        </p>
        <p className="text-gray-700">
          At any time in the negotiation, you are able to send the other party
          an offer which they can accept or reject, as well as walk away from
          the negotiation (i.e., end the negotiation). The same features are
          given to the other party. The other party is able to send you offers
          or walk away from the negotiation at any time.
        </p>
        {statedOpponent && (
          <p className="text-gray-700">
            You have been assigned to negotiate with{" "}
            {statedOpponent === 'ai' ? "an A.I." : "a human"} negotiator.
          </p>
        )}
      </div>
      <Button onClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
