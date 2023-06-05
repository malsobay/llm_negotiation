import { usePlayer } from "@empirica/core/player/classic/react";
import React from "react";
import { Button } from "../components/Button";
import { Timer } from "../components/Timer";

function Highlight({ children }) {
  return <span className="rounded bg-yellow-200 px-1">{children}</span>;
}

export function Introduction() {
  const player = usePlayer();

  const next = () => {
    player.stage.set("submit", true);
  };

  const instructions = player.get("instructions");
  const statedOpponent = player.get("statedOpponent");

  return (
    <div className="h-full w-full justify-center  overflow-auto lg:grid xl:items-center">
      <div className="lt-lg:bottom-0 absolute w-full text-center lg:top-0">
        <div className="lt-lg:mb-2 inline-block px-4 py-1 lg:mt-2">
          <Timer />
        </div>
      </div>

      {/* max-w-screen-lg */}
      <div className="lt-lg:pb-20 prose prose-bluegray w-full max-w-prose p-8 lg:pt-12">
        <h3 className="mt-0">Introduction</h3>

        <p>
          In this task, you will be asked to participate in a{" "}
          <strong>negotiation</strong> with another party. You will receive a{" "}
          <strong>bonus compensation</strong> as high as $5 based on{" "}
          <strong>how well you do</strong> on the negotiation (i.e., the price
          you are able to negotiate the table for) relative to other
          participants.
        </p>

        <p>
          At any time in the negotiation, you are able to send the other party{" "}
          <strong>an offer</strong> which they can <strong>accept</strong> or{" "}
          <strong>reject</strong>, as well as <strong>walk away</strong> from
          the negotiation (i.e., end the negotiation). The{" "}
          <strong>same features</strong> are given to the{" "}
          <strong>other party</strong>. The other party is able to send you
          offers or walk away from the negotiation at any time.
        </p>

        {statedOpponent && (
          <p className="text-bluegray-700 font-medium">
            You have been assigned to negotiate with{" "}
            <Highlight>
              {statedOpponent === "ai" ? "an A.I." : "a human"} negotiator.
            </Highlight>
          </p>
        )}

        <div className="lt-lg:w-full pt-4 lg:w-32">
          <Button onClick={next} autoFocus full>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
