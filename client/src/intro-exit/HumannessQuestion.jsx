// @ts-check
// @ts-ignore
import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";

export function HumannessQuestion({ next }) {
  const player = usePlayer();

  const [confidence, setConfidence] = useState(0); // Initial value set to 0

  function handleSubmit(event) {
    event.preventDefault();
    player.set("HumannessQuestion", { confidence });
    next();
  }

  return (
    <div className="mx-auto mt-3 w-full max-w-screen-md p-20 sm:mt-5">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Humanness Questionnaire
              </h3>
              <p className="mb-6 mt-2 text-gray-500">
                How confident are you that the other negotiator was a human? You
                will be paid based on how confident you are in the correct
                answer.
                <br></br>
                <br></br>
                For example, answering "100%" when the negotiator was actually a
                human earns $0.5, while answering "50%" earns $0.25, and
                answering "0%" earns no additional bonus.
              </p>
            </div>

            <div className="mt-6 space-y-8">
              <div>
                <label className="min-h-20 block flex items-end text-base font-medium text-gray-900">
                  Please move the slider to indicate your confidence level:
                </label>

                <div className="mt-6 flex justify-between">
                  <span>0</span>
                  <span>100</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={(e) => {
                    setConfidence(Number(e.target.value));
                  }}
                  className="slider mt-2 h-6 w-full"
                  id="myRange"
                />

                <div className="mt-2 text-center">
                  <span>Your confidence level: {confidence}%</span>
                </div>
              </div>

              <div className="mb-12">
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
