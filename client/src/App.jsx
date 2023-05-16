import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import "virtual:windi.css";
import { Game } from "./Game";
import { SubjectiveValueSurvey } from "./intro-exit/SubjectiveValueSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { Consent } from "./intro-exit/Consent";
import { Result } from "./intro-exit/Result";
import { PartnerRatingSurvey } from "./intro-exit/PartnerRating";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    return [Introduction];
  }

  function exitSteps({ game, player }) {
    return [Result, SubjectiveValueSurvey, PartnerRatingSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
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
