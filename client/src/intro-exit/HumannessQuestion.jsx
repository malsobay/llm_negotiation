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
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-md mx-auto">
      <form
        className="space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Humanness Questionnaire
              </h3>
              <p className="mt-2 mb-6 text-gray-500">
                How confident are you that the other negotiator was a human?
                You will be paid based on how confident you are in the correct answer. 
                <br></br>
                <br></br>
                For example, answering "100%" when the negotiator was actually a human
                earns $0.5, while answering "50%" earns $0.25, and answering "0%" earns no additional bonus.
              </p>
            </div>

            <div className="space-y-8 mt-6">
              <div>
                <label className="block text-sm text-gray-700">
                  Please move the slider to indicate your confidence level:
                </label>
                <div className="flex justify-between">
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
                  className="slider w-full h-6 mt-2"
                  id="myRange"
                />
                <div className="text-center mt-2">
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
