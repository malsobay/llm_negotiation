import { useStageTimer } from "@empirica/core/player/classic/react";
import React from "react";

export function Timer() {
  const timer = useStageTimer();

  let remaining;
  if (timer?.remaining || timer?.remaining === 0) {
    remaining = Math.round(timer?.remaining / 1000);
  }

  let color = "bg-gray-50 text-gray-600 ring-gray-500/10";
  if (remaining <= 10) {
    color = "bg-red-50 text-red-700 ring-red-600/10";
  } else if (remaining <= 30) {
    color = "bg-yellow-50 text-yellow-700 ring-yellow-600/10";
  }

  const basecn =
    "tabular-nums inline-flex items-center rounded-md px-2 py-1 text-base font-medium ring-1 ring-inset";

  return <div className={basecn + " " + color}>{humanTimer(remaining)}</div>;
}

function humanTimer(seconds) {
  if (seconds === null || seconds === undefined) {
    return "--:--";
  }

  let out = "";
  const s = seconds % 60;
  out += s < 10 ? "0" + s : s;

  const min = (seconds - s) / 60;
  if (min === 0) {
    return `00:${out}`;
  }

  const m = min % 60;
  out = `${m < 10 ? "0" + m : m}:${out}`;

  const h = (min - m) / 60;
  if (h === 0) {
    return out;
  }

  return `${h}:${out}`;
}
