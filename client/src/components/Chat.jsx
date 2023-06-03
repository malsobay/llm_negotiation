// @ts-check
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useInterval } from "../utils";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export function Chat({
  messages,
  playerId,
  instructions,
  onNewMessage,
  onNewProposal,
  onNewNoDeal,
  busy,
  waitingOnOtherPlayer,
  otherPlayerId,
  otherPlayerTyping,
  onAccept,
  onReject,
  onEnd,
  onContinue,
}) {
  // Auto-scroll for the chat
  /** @type {React.MutableRefObject<any[]>} */
  const prevMessages = useRef(messages);
  /** @type {React.MutableRefObject<boolean>} */
  const prevOtherPlayerTyping = useRef(otherPlayerTyping);
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const messagesContainerRef = useRef();
  const [inputMode, setInputMode] = useState("message");
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  useEffect(() => {
    if (
      prevMessages.current !== messages ||
      prevOtherPlayerTyping.current !== otherPlayerTyping
    ) {
      // @ts-ignore
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    prevMessages.current = messages;
  }, [messages, otherPlayerTyping]);

  const waitingOnProposal = !!onAccept || !!onReject;
  const waitingOnNoDeal = !!onEnd || !!onContinue;

  {
    /* <Instructions instructions={instructions} /> */
  }

  return (
    <div className="grid h-full w-full auto-cols-auto grid-flow-col grid-rows-1 items-start items-center justify-center gap-x-8 overflow-hidden p-8">
      <div className="grid max-h-full grid-rows-[1fr_90px_10px] overflow-hidden">
        <div className="flex max-w-prose flex-col justify-between gap-y-8 overflow-hidden">
          <div ref={messagesContainerRef} className="overflow-y-auto">
            <Messages
              messages={messages}
              currentPlayerId={playerId}
              typingPlayerId={otherPlayerTyping ? otherPlayerId : undefined}
              // typingPlayerId={otherPlayerId}
            />
          </div>
          <div className="pb-2">
            <InputBox
              playerId={playerId}
              waitingOnOtherPlayer={waitingOnOtherPlayer}
              waitingOnNoDeal={waitingOnNoDeal}
              waitingOnProposal={waitingOnProposal}
              onNewMessage={onNewMessage}
              onNewProposal={onNewProposal}
              setInputMode={setInputMode}
              busy={busy}
              inputMode={inputMode}
              onAccept={onAccept}
              onReject={onReject}
              onContinue={onContinue}
              onEnd={onEnd}
            />
          </div>
        </div>
        <DealArea
          waitingOnOtherPlayer={waitingOnOtherPlayer}
          waitingOnNoDeal={waitingOnNoDeal}
          waitingOnProposal={waitingOnProposal}
          inputMode={inputMode}
          setInputMode={setInputMode}
          messages={messages}
          onNewNoDeal={onNewNoDeal}
        />

        <div className="flex justify-center pt-4">
          <button
            className="bg-transparent text-gray-500"
            onClick={() => setInstructionsOpen(!instructionsOpen)}
          >
            {instructionsOpen ? "Hide" : "Show"} instructions
          </button>
        </div>
      </div>

      {instructionsOpen ? (
        <div className="prose prose-bluegray max-h-full max-w-prose overflow-hidden">
          <div className="h-full overflow-y-auto rounded-lg bg-gray-50 px-6 py-2 shadow-sm ring-1 ring-gray-900/5">
            <ReactMarkdown>{instructions}</ReactMarkdown>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function DealArea({
  waitingOnOtherPlayer,
  waitingOnNoDeal,
  waitingOnProposal,
  inputMode,
  setInputMode,
  messages,
  onNewNoDeal,
}) {
  return (
    <div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">or</span>
        </div>
      </div>

      <div>
        {!waitingOnOtherPlayer &&
          !waitingOnNoDeal &&
          !waitingOnProposal &&
          (inputMode === "message" ? (
            <div className="grid auto-cols-fr grid-flow-col gap-x-4">
              <Button
                variant="positive"
                full
                onClick={() => setInputMode("proposal")}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="h-full w-full fill-current"
                  >
                    <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                  </svg>
                }
              >
                Propose a deal
              </Button>
              {messages.length > 0 && onNewNoDeal && (
                <Button
                  variant="negative"
                  full
                  onClick={onNewNoDeal}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-full w-full fill-current"
                    >
                      <path d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
                    </svg>
                  }
                >
                  End with no deal
                </Button>
              )}
            </div>
          ) : (
            <div>
              <span>If you've changed your mind </span>
              <Button full onClick={() => setInputMode("message")}>
                Keep negotiating
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}

function InputBox({
  playerId,
  waitingOnOtherPlayer,
  waitingOnNoDeal,
  waitingOnProposal,
  onNewMessage,
  onNewProposal,
  setInputMode,
  busy,
  inputMode,
  onAccept,
  onReject,
  onContinue,
  onEnd,
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-6 shrink-0">
        <Avatar index={0} playerId={playerId} />
      </div>
      <div className="w-full">
        {waitingOnOtherPlayer && (
          <div>
            <div>Waiting on the other player...</div>
            <div>
              <div></div>
            </div>
          </div>
        )}
        {!waitingOnOtherPlayer && !waitingOnNoDeal && !waitingOnProposal && (
          <Input
            onNewMessage={onNewMessage}
            onNewProposal={(proposal) => {
              onNewProposal(proposal);
              setInputMode("message");
            }}
            busy={busy}
            mode={inputMode}
          />
        )}
        {!waitingOnOtherPlayer && waitingOnProposal && (
          <ButtonsContainer>
            {onAccept && <button onClick={onAccept}>Accept</button>}
            {onReject && <button onClick={onReject}>Reject</button>}
          </ButtonsContainer>
        )}
        {waitingOnNoDeal && (
          <ButtonsContainer>
            {onContinue && (
              <button onClick={onContinue}>Keep negotiating</button>
            )}
            {onEnd && <button onClick={onEnd}>End with no deal</button>}
          </ButtonsContainer>
        )}
      </div>
    </div>
  );
}

function TextMessage({ message, currentPlayerId, maxSize }) {
  let sliced = false;
  let text = message.text;
  if (maxSize > 0 && message.text.length > maxSize) {
    text = text.slice(0, maxSize);
    sliced = true;
  }

  const self = message.playerId == currentPlayerId;

  return (
    <div className="flex items-start space-x-4">
      <div className="mt-.5 w-6 shrink-0">
        <Avatar index={self ? 0 : 1} playerId={message.playerId} />
      </div>
      <div className={self ? "text-bluegray-500" : "text-gray-700"}>
        {text}
        {sliced ? <span>[...]</span> : ""}
      </div>
    </div>
  );
}

function TypingIndicator({ playerId }) {
  const [count, setCount] = useState(1);

  useInterval(() => {
    console.log("This will run every second!");
    if (count < 3) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  }, 350);

  return (
    <div className="flex space-x-4">
      <div className="w-6 shrink-0">
        <Avatar index={1} playerId={playerId} />
      </div>
      <div className="text-gray-400">Typing{".".repeat(count)}</div>
    </div>
  );
}

function ButtonsContainer({ children }) {
  return <div>{children}</div>;
}

function ProposalMessage({ message }) {
  return (
    <div>
      <div className="w-16 shrink-0">
        <Avatar index={1} playerId={message.playerId} />
      </div>
      <div>
        <div>
          Proposed a deal:{" "}
          <b>
            {Intl.NumberFormat([], {
              style: "currency",
              currency: "USD",
            }).format(message.proposal)}
          </b>
        </div>
        <div>
          {message.proposalStatus === "accepted" && <span>Accepted</span>}
          {message.proposalStatus === "rejected" && <span>Rejected</span>}
        </div>
      </div>
    </div>
  );
}

function NoDealMessage({ message }) {
  return (
    <div>
      <div className="w-16 shrink-0">
        <Avatar index={1} playerId={message.playerId} />
      </div>
      <div>
        <div>Proposed to end without a deal</div>
        <div>
          {message.noDealStatus === "ended" && <span>Ended with no deal</span>}
          {message.noDealStatus === "continued" && (
            <span>Continued negotiations</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Instructions({ instructions = "" }) {
  const [shown, setShown] = useState(true);
  return (
    <div className="grid self-start p-4 text-gray-500">
      <div className="flex items-baseline space-x-2">
        <h2 className="font-medium">Instructions</h2>
        {/* Button to hide instructions */}
        <button
          className="text-xs text-blue-400"
          onClick={() => setShown(!shown)}
        >
          {shown ? "Hide" : "Show"}
        </button>
      </div>
      {shown && (
        <p className="overflow-y-auto whitespace-pre-line break-words">
          {instructions}
        </p>
      )}
    </div>
  );
}

function Messages({ messages, currentPlayerId, maxSize = 0, typingPlayerId }) {
  return (
    <div className="space-y-2">
      {messages.length > 0 &&
        messages.map((message, i) => (
          <React.Fragment key={i}>
            {message.type === "message" && (
              <TextMessage
                currentPlayerId={currentPlayerId}
                message={message}
                maxSize={maxSize}
                key={message.id}
              />
            )}
            {message.type === "proposal" && (
              <ProposalMessage message={message} key={message.id} />
            )}
            {message.type === "no-deal" && (
              <NoDealMessage message={message} key={message.id} />
            )}
          </React.Fragment>
        ))}
      {!!typingPlayerId && <TypingIndicator playerId={typingPlayerId} />}
      {messages.length === 0 && !typingPlayerId && (
        <div>
          <p>No messages yet</p>
        </div>
      )}
    </div>
  );
}

function Input({ onNewMessage, onNewProposal, busy, mode }) {
  switch (mode) {
    case "message":
      return <MessageInput onNewMessage={onNewMessage} busy={busy} />;
    case "proposal":
      return <ProposalInput onNewProposal={onNewProposal} busy={busy} />;
    default:
      return null;
  }
}

function MessageInput({ onNewMessage, busy }) {
  /** @type {React.MutableRefObject<HTMLTextAreaElement>} */
  const textAreaRef = useRef();
  /** @type {React.MutableRefObject<HTMLFormElement>} */
  const formRef = useRef();

  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Resize to text for the text input area
  const resize = () => {
    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${Math.min(
      textAreaRef.current.scrollHeight,
      200
    )}px`;
  };

  // Enable the button if there is text in the input area
  const changeButtonStatus = () => {
    setButtonEnabled(textAreaRef.current.value.length > 0);
  };

  const handleOnChange = (e) => {
    resize();
    changeButtonStatus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = textAreaRef.current.value;

    if (text.length > 1024) {
      e.preventDefault();

      alert("Max message length is 1024");

      return;
    }

    onNewMessage(text);

    textAreaRef.current.value = "";
    handleOnChange();
  };

  const placeholder = busy ? "Sending your message..." : "Negociate...";

  const disabled = busy;
  const prevDisabled = useRef(disabled);

  // Focus the text input area when the input is enabled back
  useLayoutEffect(() => {
    if (!disabled && prevDisabled.current) {
      textAreaRef.current.focus();
    }
    prevDisabled.current = disabled;
  }, [disabled]);

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <fieldset disabled={disabled}>
        <div className="flex items-start space-x-4">
          <textarea
            autoFocus={true}
            className="ring-none text-md peer w-full resize-none rounded-md border-none bg-gray-50 px-2 py-1 pr-0 leading-snug text-gray-600 ring-1 ring-inset ring-gray-500/10 placeholder:text-gray-300 focus:ring-gray-500/50"
            placeholder={placeholder}
            onChange={handleOnChange}
            onKeyDown={(e) => {
              if (e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                formRef.current.requestSubmit();
              }
            }}
            ref={textAreaRef}
            name="text"
          />

          <Button
            type="submit"
            className="mt-[1px]"
            variant={buttonEnabled ? "secondary" : "disabled"}
            disabled={!buttonEnabled}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-full w-full fill-current"
              >
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
              </svg>
            }
          >
            Send
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

function ProposalInput({ onNewProposal, busy }) {
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputRef = useRef();
  /** @type {React.MutableRefObject<HTMLFormElement>} */
  const formRef = useRef();

  const [buttonEnabled, setButtonEnabled] = useState(false);

  // Enable the button if there is text in the input area
  const changeButtonStatus = () => {
    setButtonEnabled(inputRef.current.value.length > 0);
  };

  const handleOnChange = (e) => {
    changeButtonStatus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = inputRef.current.value;

    if (text.length > 1024) {
      e.preventDefault();

      alert("Max message length is 1024");

      return;
    }

    const textWithoutCurrency = text.replace("$", "");

    const price = parseInt(textWithoutCurrency);

    if (isNaN(price)) {
      e.preventDefault();
      alert("Price must be a number");
      return;
    }

    onNewProposal(price);

    inputRef.current.value = "";
    handleOnChange();
  };

  const placeholder = busy
    ? "Sending proposal..."
    : "Offer your price, e.g. 100";

  const disabled = busy;

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <fieldset
        disabled={disabled}
        className="flex w-full flex-row items-center space-x-2 font-semibold"
      >
        <div>
          <span className="text-gray-600">$</span>
        </div>

        <input
          autoFocus={true}
          className="ring-none text-md peer w-full resize-none border-none bg-transparent px-2 py-1 pr-0 leading-snug text-gray-600 placeholder:text-gray-300 focus:ring-0"
          placeholder={placeholder}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (e.keyCode == 13 && e.shiftKey == false) {
              e.preventDefault();
              formRef.current.requestSubmit();
            }
          }}
          inputMode="numeric"
          ref={inputRef}
          name="text"
        />

        <Button
          type="submit"
          className="mt-[1px]"
          variant={!buttonEnabled ? "primary" : "secondary"}
        >
          Send
        </Button>
      </fieldset>
    </form>
  );
}
