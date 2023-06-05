import React from "react";
import { Stage } from "./Stage";

export function Game() {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 overflow-hidden">
      <Stage />
    </div>
  );
}
