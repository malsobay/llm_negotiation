import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20 w-full max-w-screen-md mx-auto">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instructions
      </h3>
      <div className="mt-2 mb-6 space-y-2">
        <p className="text-gray-700">
          You will be presented with a series of negotiation scenarios. In each
          scenario you will be assigned a role and paired with another
          participant.
        </p>
        <p className="text-gray-700">
          You will be negotiating in turns. On each turn, you will be able to
          send a message to the other participant to negotiate the deal. The
          other participant will then be able to reply back to you.
        </p>
        <p className="text-gray-700">
          On each turn, you will be able to make an offer to the other
          participant. The other participant will then be able to accept or
          reject your offer. If they accept, the negotiation ends. If they
          reject, the negotiation continues.
        </p>
        <p className="text-gray-700">
          You also have an option to end negotiation without a deal. When you
          choose this option, the other participant will be able to either
          confirm or reject your decision. If they confirm, the negotiation
          ends. If they reject, the negotiation continues.
        </p>
        <p className="text-gray-700">
          The other participant will also be able to make an offer to you, or
          end negotiation without a deal. You will be able to accept or reject
          their offer, or confirm or reject their decision to end negotiation
          without a deal.
        </p>
      </div>
      <Button onClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
