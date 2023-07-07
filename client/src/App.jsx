import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { SubjectiveValueSurvey } from "./intro-exit/SubjectiveValueSurvey";
import { Consent } from "./intro-exit/Consent";
import { Result } from "./intro-exit/Result";
import { PartnerRatingSurvey } from "./intro-exit/PartnerRating";
import { Strategy } from "./intro-exit/Strategy";
import { HumannessQuestion } from "./intro-exit/HumannessQuestion";
import { Demographic } from "./intro-exit/Demographic";
import { Introduction } from "./intro-exit/Introduction";
import { InstructionsTwo } from "./intro-exit/InstructionsTwo";
import {Lobby} from "./intro-exit/Lobby.jsx"

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Introduction, InstructionsTwo];
  }

  function exitSteps({ game, player }) {
    return [
      Result,
      SubjectiveValueSurvey,
      PartnerRatingSurvey,
      Strategy,
      HumannessQuestion,
      Demographic,
    ];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="relative h-screen">
        <EmpiricaMenu />
        <div className="h-full overflow-auto">
          <EmpiricaContext
            introSteps={introSteps}
            exitSteps={exitSteps}
            consent={Consent}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
