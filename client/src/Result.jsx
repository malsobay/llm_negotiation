import React from "react";
import { Button } from "./components/Button";

export function Result({ next, game }) {
  const result = game.get("result");
  const price = game.get("price");

  return (
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-md mx-auto">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Result</h3>
      <div className="mt-2 mb-6 space-y-2">
        <p className="text-gray-700">Negotiation is over.</p>
        {result === "no-deal" && (
          <p className="text-gray-700">
            You've decided to end negotiation without a deal.
          </p>
        )}
        {result === "deal-reached" && (
          <p className="text-gray-700">
            You've reached a deal with a final price of{" "}
            <strong>
              {Intl.NumberFormat([], {
                style: "currency",
                currency: "USD",
              }).format(price)}
            </strong>
            .
          </p>
        )}
      </div>
      <Button onClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
