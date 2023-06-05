import { usePlayer } from "@empirica/core/player/classic/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../components/Button";
import { Timer } from "../components/Timer";

function Highlight({ children }) {
  return <span className="rounded bg-yellow-200 px-1">{children}</span>;
}

export function Instructions() {
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
        <h3 className="mt-0">Instructions</h3>

        <p>Here are the instructions for this negotiation:</p>

        <div className="flex">
          <div className="w-prose rounded-lg bg-gray-50 px-6 py-2 shadow-sm ring-1 ring-gray-900/5">
            <ReactMarkdown>{instructions}</ReactMarkdown>
          </div>
        </div>

        <p>
          <em>
            Please note that these instructions will always be accessible to you
            during the negotiation.
          </em>
        </p>

        <div className="lt-lg:w-full pt-4 lg:w-32">
          <Button onClick={next} autoFocus full>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
