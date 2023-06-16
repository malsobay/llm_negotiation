// @ts-check
import React, { useState } from "react";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { NoDealMessage, ProposalMessage } from "./Messages";
import { Divider } from "../Divider";

export function DealArea({
  waitingOnOtherPlayer,
  waitingOnNoDeal,
  waitingOnProposal,
  inputMode,
  setInputMode,
  messages,
  onNewNoDeal,
  onNewProposal,
  onAccept,
  onReject,
  onContinue,
  onEnd,
}) {
  const canTakeAction =
    !waitingOnOtherPlayer &&
    !waitingOnNoDeal &&
    !waitingOnProposal &&
    inputMode === "message";
  const canEndNoDeal = messages.length > 0 && Boolean(onNewNoDeal);

  return (
    <div>
      {inputMode === "proposal" && (
        <Modal onClickOut={() => setInputMode("message")} showCloseButton>
          <ProposalInput
            busy={waitingOnProposal}
            onNewProposal={onNewProposal}
            onCancel={() => setInputMode("message")}
          />
        </Modal>
      )}

      {!waitingOnOtherPlayer && waitingOnProposal && (
        <Modal onClickOut={() => setInputMode("message")}>
          <AcceptReject
            onAccept={onAccept}
            onReject={onReject}
            proposalMessage={messages[messages.length - 1]}
          />
        </Modal>
      )}

      {waitingOnNoDeal && (
        <Modal onClickOut={() => setInputMode("message")}>
          <ContinueEnd
            onContinue={onContinue}
            onEnd={onEnd}
            noDealMessage={messages[messages.length - 1]}
          />
        </Modal>
      )}

      <Divider text="or" />

      <PositiveNegativeButtons
        positiveText="Propose a deal"
        positiveAction={() => setInputMode("proposal")}
        positiveDisabled={!canTakeAction}
        negativeText="End with no deal"
        negativeAction={onNewNoDeal}
        negativeDisabled={!canTakeAction || !canEndNoDeal}
      />
    </div>
  );
}

function AcceptReject({ onAccept, onReject, proposalMessage }) {
  return (
    <div className="lg:min-w-96 max-w-prose">
      <div className="rounded bg-gray-100 p-2">
        <ProposalMessage
          message={proposalMessage}
          // We can just put anything in here, since it's just checking the
          // message is from self, and in this case, it is not.
          currentPlayerId={"not self"}
          hidePending
        />
      </div>

      <div className="mt-4">
        <PositiveNegativeButtons
          positiveText="Accept"
          positiveAction={onAccept}
          positiveDisabled={!onAccept}
          negativeText="Reject"
          negativeAction={onReject}
          negativeDisabled={!onReject}
        />
      </div>
    </div>
  );
}

function ContinueEnd({ noDealMessage, onContinue, onEnd }) {
  return (
    <div className="lg:min-w-96 max-w-prose">
      <div className="rounded bg-gray-100 p-2">
        <NoDealMessage
          message={noDealMessage}
          // We can just put anything in here, since it's just checking the
          // message is from self, and in this case, it is not.
          currentPlayerId={"not self"}
          hidePending
        />
      </div>
      <div className="mt-4">
        <PositiveNegativeButtons
          positiveText="Keep negotiating"
          positiveAction={onContinue}
          positiveDisabled={!onContinue}
          negativeText="End with no deal"
          negativeAction={onEnd}
          negativeDisabled={!onEnd}
        />
      </div>
    </div>
  );
}

function PositiveNegativeButtons({
  positiveAction,
  positiveText,
  positiveDisabled = false,
  negativeAction,
  negativeText,
  negativeDisabled = false,
}) {
  return (
    <div className="grid auto-cols-fr grid-flow-col gap-x-4">
      <Button
        variant="positive"
        full
        onClick={positiveAction}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-full w-full fill-current"
          >
            <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
          </svg>
        }
        disabled={positiveDisabled}
      >
        {positiveText}
      </Button>
      <Button
        variant="negative"
        full
        onClick={negativeAction}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="h-full w-full fill-current"
          >
            <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
          </svg>
        }
        disabled={negativeDisabled}
      >
        {negativeText}
      </Button>
    </div>
  );
}

function ProposalInput({ onNewProposal, onCancel, busy }) {
  const [value, setValue] = useState("");

  const handleOnChange = (e) => {
    setValue(e.target.value.replace(/\D/, ""));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (value.length > 12) {
      e.preventDefault();

      alert("Max length is 12");

      return;
    }

    const price = parseInt(value, 10);

    if (isNaN(price)) {
      e.preventDefault();
      alert("Price must be a number");

      return;
    }

    onNewProposal(price);
    setValue("");
  };

  const placeholder = busy
    ? "Sending proposal..."
    : "Offer your price, e.g. 100";

  const disabled = busy;

  return (
    <form className="lg:min-w-96 max-w-prose" onSubmit={handleSubmit}>
      <fieldset disabled={disabled}>
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Deal
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              id="price"
              className="block w-full rounded-md border-0 !py-1.5 !pl-7 !pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:!ring-teal-600 sm:text-sm sm:leading-6"
              aria-describedby="price-currency"
              autoFocus
              placeholder={placeholder}
              onChange={handleOnChange}
              value={value}
              inputMode="numeric"
              name="text"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                USD
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Button type="submit" disabled={busy || value.trim().length === 0}>
            Submit
          </Button>
          <Button onClick={onCancel} variant="secondary" disabled={busy}>
            Cancel
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
