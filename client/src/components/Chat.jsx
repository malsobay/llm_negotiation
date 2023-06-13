// @ts-check
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { CHAT_RESPONSIVE_COLUMNS } from "../constants";

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

  const [inputMode, setInputMode] = useState("message");

  const waitingOnProposal = !!onAccept || !!onReject;
  const waitingOnNoDeal = !!onEnd || !!onContinue;

  return (
    <div
      className={`grid w-full h-full px-2 py-2 pointer-events-auto ${
        CHAT_RESPONSIVE_COLUMNS ? "grid-flow-row lg:grid-flow-col" : ""
      }`}
      style={{
        gridAutoColumns: "minmax(0, auto) minmax(50%, 1fr)",
        gridAutoRows: "minmax(0, auto) minmax(50%, 1fr)",
      }}
    >
      <Instructions instructions={instructions} />
      <div className="rounded-2xl outline outline-2 outline-gray-300 pb-2 flex-grow flex flex-col justify-end font-mono bg-white/95 max-h-full">
        <div className="overflow-auto p-2 flex-grow" ref={messagesContainerRef}>
          <Messages
            messages={messages}
            typingPlayerId={otherPlayerTyping ? otherPlayerId : undefined}
          />
        </div>
        <div className="px-2">
          {!waitingOnOtherPlayer &&
            !waitingOnNoDeal &&
            !waitingOnProposal &&
            (inputMode === "message" ? (
              <div className="text-sm pl-12 py-2 text-gray-500">
                <span>When you're ready </span>
                <button
                  className="border border-green-500 text-green-500 px-2 py-1 rounded-md text-xs"
                  onClick={() => setInputMode("proposal")}
                >
                  Propose a deal
                </button>
                {messages.length > 0 && onNewNoDeal && (
                  <>
                    <span> or </span>
                    <button
                      className="border border-red-500 text-red-500 px-2 py-1 rounded-md text-xs"
                      onClick={onNewNoDeal}
                    >
                      End with no deal
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-sm pl-12 pb-2 text-gray-500">
                <span>If you've changed your mind </span>
                <button
                  className="border border-blue-500 text-blue-500 px-2 py-1 rounded-md text-xs"
                  onClick={() => setInputMode("message")}
                >
                  Keep negotiating
                </button>
              </div>
            ))}
          <div className="w-full flex flex-row items-center rounded-xl pl-2 pr-1 py-1 ring-2 bg-gray-50 ring-gray-200 focus-within:ring-gray-400 space-x-2">
            <div className="w-6 h-6 flex-shrink-0">
              <Avatar playerId={playerId} />
            </div>
            <div className="flex-grow">
              {waitingOnOtherPlayer && (
                <div className="flex items-center space-x-2">
                  <div className="text-gray-500 py-1">
                    Waiting on the other player...
                  </div>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
                  </div>
                </div>
              )}
              {!waitingOnOtherPlayer &&
                !waitingOnNoDeal &&
                !waitingOnProposal && (
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
                  {onAccept && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      onClick={onAccept}
                    >
                      Accept
                    </button>
                  )}
                  {onReject && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={onReject}
                    >
                      Reject
                    </button>
                  )}
                </ButtonsContainer>
              )}
              {waitingOnNoDeal && (
                <ButtonsContainer>
                  {onContinue && (
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      onClick={onContinue}
                    >
                      Keep negotiating
                    </button>
                  )}
                  {onEnd && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                      onClick={onEnd}
                    >
                      End with no deal
                    </button>
                  )}
                </ButtonsContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   message: import("../useGameMechanics").Message;
 *   maxSize?: number;
 * }} param0
 */
function TextMessage({ message, maxSize }) {
  let sliced = false;
  let text = message.text;
  if (maxSize > 0 && message.text.length > maxSize) {
    text = text.slice(0, maxSize);
    sliced = true;
  }

  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar playerId={message.playerId} />
      </div>
      <div>
        {text}
        {sliced ? <span className="text-gray-400 pl-2">[...]</span> : ""}
      </div>
    </div>
  );
}

function TypingIndicator({ playerId }) {
  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar playerId={playerId} />
      </div>
      <div>
        <div className="text-gray-500 text-sm">is typing...</div>
      </div>
    </div>
  );
}

function ButtonsContainer({ children }) {
  return <div className="grid grid-flow-col gap-x-2 w-full">{children}</div>;
}

/**
 * @param {{
 *   message: import("../useGameMechanics").Message;
 * }} param0
 */
function ProposalMessage({ message }) {
  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar playerId={message.playerId} />
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
          {message.proposalStatus === "accepted" && (
            <span className="text-green-500">Accepted</span>
          )}
          {message.proposalStatus === "rejected" && (
            <span className="text-red-500">Rejected</span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   message: import("../useGameMechanics").Message;
 * }} param0
 */
function NoDealMessage({ message }) {
  return (
    <div className="p-2 flex items-start space-x-2">
      <div className="w-6 h-6 flex-shrink-0">
        <Avatar playerId={message.playerId} />
      </div>
      <div>
        <div>Proposed to end without a deal</div>
        <div>
          {message.noDealStatus === "ended" && (
            <span className="text-red-500">Ended with no deal</span>
          )}
          {message.noDealStatus === "continued" && (
            <span className="text-green-500">Continued negotiations</span>
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

/**
 * @param {{
 *   messages: import("../useGameMechanics").Message[];
 *   maxSize?: number;
 *   typingPlayerId?: string;
 * }} param0
 * @returns
 */
function Messages({ messages, maxSize = 0, typingPlayerId }) {
  return (
    <>
      {messages.length > 0 &&
        messages.map((message, i) => (
          <React.Fragment key={i}>
            {message.type === "message" && (
              <TextMessage
                message={message}
                maxSize={maxSize}
                key={message.id}
              />
            )}
            {message.type === "proposal" && (
              <>
                {message.text && (
                  <TextMessage
                    message={message}
                    maxSize={maxSize}
                    key={message.id}
                  />
                )}
                <ProposalMessage message={message} key={message.id} />
              </>
            )}
            {message.type === "no-deal" && (
              <>
                <NoDealMessage message={message} key={message.id} />
                {message.text && (
                  <TextMessage
                    message={message}
                    maxSize={maxSize}
                    key={message.id}
                  />
                )}
              </>
            )}
          </React.Fragment>
        ))}
      {!!typingPlayerId && <TypingIndicator playerId={typingPlayerId} />}
      {messages.length === 0 && !typingPlayerId && (
        <div className="h-full flex items-center justify-center">
          <p className="p-8 text-gray-500">No messages yet</p>
        </div>
      )}
    </>
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

  const placeholder = busy ? "Sending your message..." : "Say something...";

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
      <fieldset
        disabled={disabled}
        className="w-full font-semibold flex flex-row items-center space-x-2"
      >
        <textarea
          autoFocus={true}
          className="peer resize-none w-full py-1 px-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
          rows={1}
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

        <Button type="submit" className="mt-[1px]" primary={!buttonEnabled}>
          Send
        </Button>
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
        className="w-full font-semibold flex flex-row items-center space-x-2"
      >
        <div>
          <span className="text-gray-600">$</span>
        </div>

        <input
          autoFocus={true}
          className="peer resize-none w-full py-1 px-2 pr-0 ring-none border-none leading-snug bg-transparent placeholder:text-gray-300 text-md focus:ring-0 text-gray-600"
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

        <Button type="submit" className="mt-[1px]" primary={!buttonEnabled}>
          Send
        </Button>
      </fieldset>
    </form>
  );
}
