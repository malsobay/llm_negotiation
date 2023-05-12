// @ts-check
// @ts-ignore
import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import QuestionRadioGroup from "../components/QuestionRadioGroup";

const defaultOptions = {
  1: "Not at all",
  2: "A little",
  3: "A moderate amount",
  4: "A lot",
  5: "A great deal",
};

const questions = [
  {
    question: "How assertive was your COUNTERPART?",
    name: "pr-q1",
    options: defaultOptions,
  },
  {
    question: "How much empathy did your COUNTERPART convey?",
    name: "pr-q2",
    options: defaultOptions,
  },
  {
    question: "How warm was your COUNTERPART?",
    name: "pr-q3",
    options: defaultOptions,
  },
  {
    question: "How competent was your COUNTERPART?",
    name: "pr-q4",
    options: defaultOptions,
  },
];

const defaultAnswers = questions.reduce((acc, { name }) => {
  acc[name] = undefined;
  return acc;
}, {});

export function PartnerRatingSurvey({ next }) {
  const player = usePlayer();

  const [answers, setAnswers] = useState(defaultAnswers);

  function handleSubmit(event) {
    event.preventDefault();
    player.set("partnerRatingSurvey", answers);
    next();
  }

  return (
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-md mx-auto">
      <form
        className="mt-12 space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="space-y-8 divide-y divide-gray-200">
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Partner rating
              </h3>
              <p className="mt-2 mb-6 text-gray-500">
                Recollecting the negotiation you just had, please answer the
                following questions about your counterpart.
              </p>
            </div>

            <div className="space-y-8 mt-6">
              {questions.map(({ question, name, options }) => (
                <QuestionRadioGroup
                  key={name}
                  question={question}
                  options={options}
                  value={answers[name]}
                  onChange={(e) => {
                    setAnswers({ ...answers, [name]: e.target.value });
                  }}
                  required
                />
              ))}

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
