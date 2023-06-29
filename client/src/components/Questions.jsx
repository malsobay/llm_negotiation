import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import QuestionRadioGroup from "./QuestionRadioGroup";
import { Button } from "../components/Button";


export function Questions({
  questions,
  onDone,
  playerKey,
  withLabelKey = false,
  groupSize = 1,
}) {
  const player = usePlayer();
  const answers = player.get(playerKey) || {};
  const [currentGroup, setCurrentGroup] = useState(0);

  // Calculate the range of questions for the current group
  const start = currentGroup * groupSize;
  const end = start + groupSize;
  const groupQuestions = questions.slice(start, end);

  function setAnswers(updatedAnswers) {
    const newAnswers = { ...answers, ...updatedAnswers };
    player.set(playerKey, newAnswers);
  }

  const handleNextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    if (currentGroup === Math.floor(questions.length / groupSize) - 1) {
      onDone();
    }
  };

  return (
    <div>
      {groupQuestions.map(({ question, name, options }) => (
        <QuestionRadioGroup
          key={name}
          question={question}
          options={options}
          value={answers[name]}
          onChange={(e) => {
            const updatedAnswers = { [name]: e.target.value };
            setAnswers(updatedAnswers);
          }}
          required
          withLabelKey={withLabelKey}
        />
      ))}

      {currentGroup < Math.floor(questions.length / groupSize) - 1 ? (
        <div className="mt-7">
          <Button onClick={handleNextGroup} autoFocus>
          <p>Next</p>
        </Button>
        </div>
      ) : 
      <div className="mt-7">
          <Button onClick={onDone} autoFocus>
        <p>Next</p>
      </Button>
        </div>
      }
    </div>
  );
}