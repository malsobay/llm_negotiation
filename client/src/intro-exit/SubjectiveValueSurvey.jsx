// @ts-check
// @ts-ignore
import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Button } from "../components/Button";
import QuestionRadioGroup from "../components/QuestionRadioGroup";

const emptyOptions = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
};

const defaultOptions = {
  ...emptyOptions,
  1: "Not at all",
  4: "Moderately",
  7: "Perfectly",
};

const greatDealOptions = {
  ...defaultOptions,
  7: "A great deal",
};

const questions = [
  {
    question:
      "How satisfied are you with your negotiation outcome—i.e., the extent to which the terms of your agreement (or lack of agreement) benefit you?",
    name: "sv-q1",
    options: defaultOptions,
  },
  {
    question:
      "How satisfied are you with the balance between your negotiation outcome and your counterpart's outcome?",
    name: "sv-q2",
    options: defaultOptions,
  },
  {
    question: "Did you feel like you forfeited or “lost” in this negotiation?",
    name: "sv-q3",
    options: greatDealOptions,
  },
  {
    question:
      "Do you think the terms of your negotiation agreement are consistent with principles of legitimacy or objective criteria (e.g., common standards of fairness, precedent, industry practice, legality, etc.)?",
    name: "sv-q4",
    options: defaultOptions,
  },
  {
    question:
      "Did you “lose face” (i.e., damage your sense of pride) in the negotiation?",
    name: "sv-q5",
    options: greatDealOptions,
  },
  {
    question:
      "Did this negotiation make you feel more or less competent as a negotiator?",
    name: "sv-q6",
    options: {
      ...emptyOptions,
      1: "It made me feel _less_ competent",
      4: "It did not make me feel more or less competent",
      7: "It made me feel _more_ competent",
    },
  },
  {
    question:
      "Did you behave according to your own principles and values in the negotiation with your counterpart?",
    name: "sv-q7",
    options: defaultOptions,
  },
  {
    question:
      "Did this negotiation positively or negatively impact your self-image or your impression of yourself?",
    name: "sv-q8",
    options: {
      ...emptyOptions,
      1: "It _negatively_ impacted my self-image",
      4: "It did not positively or negatively impact my self-image",
      7: "It _positively_ impacted my self-image",
    },
  },
  {
    question: "Do you feel your counterpart listened to your concerns?",
    name: "sv-q9",
    options: defaultOptions,
  },
  {
    question:
      "Would you characterize the negotiation process with your counterpart as fair?",
    name: "sv-q10",
    options: defaultOptions,
  },
  {
    question:
      "How satisfied are you with the ease (or difficulty) of reaching an agreement with your counterpart?",
    name: "sv-q11",
    options: defaultOptions,
  },
  {
    question: "Did your counterpart consider your wishes, opinions, or needs?",
    name: "sv-q12",
    options: defaultOptions,
  },
  {
    question:
      "What kind of “overall” impression did your counterpart make on you?",
    name: "sv-q13",
    options: {
      ...emptyOptions,
      1: "Extremely _negative_",
      4: "Neither negative nor positive",
      7: "Extremely _positive_",
    },
  },
  {
    question:
      "How satisfied are you with your relationship with your counterpart as a result of this negotiation?",
    name: "sv-q14",
    options: defaultOptions,
  },
  {
    question: "Did the negotiation make you trust your counterpart?",
    name: "sv-q15",
    options: defaultOptions,
  },
  {
    question:
      "Did the negotiation build a good foundation for a future relationship with your counterpart?",
    name: "sv-q16",
    options: defaultOptions,
  },
];

const defaultAnswers = questions.reduce((acc, { name }) => {
  acc[name] = undefined;
  return acc;
}, {});

export function SubjectiveValueSurvey({ next }) {
  const player = usePlayer();

  const [answers, setAnswers] = useState(defaultAnswers);

  function handleSubmit(event) {
    event.preventDefault();
    player.set("subjectiveValueSurvey", answers);
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
                Post negotiation survey
              </h3>
              <p className="mt-2 mb-6 text-gray-500">
                The questions below are about your negotiation with your
                counterpart. For each question, please select a number from 1-7
                that most accurately reflects your opinion. You will notice that
                some of the questions are similar to one another; this is
                primarily to ensure the validity and reliability of the
                questionnaire. Please simply answer each question independently,
                without reference to any of the other questions.
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
                  withLabelKey
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
