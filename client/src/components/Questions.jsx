import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import QuestionRadioGroup from "./QuestionRadioGroup";

export function Questions({
  questions,
  onDone,
  playerKey,
  withLabelKey = false,
}) {
  const player = usePlayer();
  const answers = player.get(playerKey) || {};
  const [current, setCurrent] = useState(
    questions.findIndex((q) => !answers[q.name])
  );

  function setAnswers(answers) {
    player.set(playerKey, answers);
  }

  const { question, name, options } = questions[current];

  return (
    <div>
      <QuestionRadioGroup
        key={name}
        question={question}
        options={options}
        value={answers[name]}
        onChange={(e) => {
          setAnswers({ ...answers, [name]: e.target.value });
          if (current === questions.length - 1) {
            onDone();
            return;
          }
          setCurrent(current + 1);
        }}
        required
        withLabelKey={withLabelKey}
      />

      {current !== 0 && (
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center space-x-1 bg-transparent text-gray-400 hover:text-gray-700"
            onClick={() => {
              if (current === 0) return;
              setCurrent(current - 1);
            }}
          >
            <div className="h-4 w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="h-full w-full fill-current"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </div>
            <div>Previous</div>
          </button>
        </div>
      )}
    </div>
  );
}
