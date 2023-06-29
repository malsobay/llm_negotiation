// @ts-check
// @ts-ignore
import { usePlayer } from "@empirica/core/player/classic/react";
import React, { useState } from "react";
import { Questions } from "../components/Questions";

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
      1: "It made me feel **less** competent",
      4: "It did not make me feel more or less competent",
      7: "It made me feel **more** competent",
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
      1: "It **negatively** impacted my self-image",
      4: "It did not positively or negatively impact my self-image",
      7: "It **positively** impacted my self-image",
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
      1: "Extremely **negative**",
      4: "Neither negative nor positive",
      7: "Extremely **positive**",
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

export function SubjectiveValueSurvey({ next }) {
  return (
    <div className="mx-auto mt-3 w-full max-w-screen-md p-20 sm:mt-5">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Post negotiation survey
      </h3>
      <p className="mt-2 text-gray-500">
        These questions are about your negotiation with your counterpart. For
        each question, please select a number from 1-7 that most accurately
        reflects your opinion. You will notice that some of the questions are
        similar to one another; this is primarily to ensure the validity and
        reliability of the questionnaire. Please simply answer each question
        independently, without reference to any of the other questions.
      </p>

      <div className="mt-12">
        <Questions
          playerKey="subjectiveValueSurvey"
          questions={questions}
          onDone={next}
          withLabelKey
          groupSize={4}
        />
      </div>
    </div>
  );
}
