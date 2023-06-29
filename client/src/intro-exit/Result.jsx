import { useGame, usePlayer } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import { Messages } from "../components/chat/Messages";
import { Divider } from "../components/Divider";

export function Result({ next }) {
  const game = useGame();
  const player = usePlayer();

  const result = game.get("result");
  const price = game.get("price");
  const messages = game.get("messages");

  return (
    <div className="mx-auto mt-3 w-full max-w-screen-md p-20 sm:mt-5">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Result</h3>
      <div className="mb-6 mt-2 space-y-2">
        <p className="text-gray-700">The negotiation is over.</p>
        {result === "no-deal" && (
          <p className="text-gray-700">The negotiation ended without a deal.</p>
        )}
        {result === "deal-reached" && (
          <p className="text-gray-700">
            You've reached a deal with a final price of{" "}
            <strong>
              {Intl.NumberFormat([], {
                style: "currency",
                currency: "USD",
              }).format(price)}
            </strong>
            .
          </p>
        )}
      </div>

      <div className="flex justify-end">
          <div className="mt-4">
            <Button onClick={next} autoFocus>
              Next
            </Button>
          </div>
      </div>
    
      <Divider text="Transcript" />

      <div className="max-h-100 overflow-y-scroll">
        <Messages messages={messages} currentPlayerId={player.id} />
      </div>

      <Divider text="End of Transcript" />

      <div className="flex justify-end">
          <div className="mt-4">
            <Button onClick={next} autoFocus>
              Next
            </Button>
          </div>
      </div>
    </div>
  );
}
