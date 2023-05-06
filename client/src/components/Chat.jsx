// @ts-check
import React, { useEffect, useRef, useState } from "react";
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
  onAccept,
  onReject,
  onEnd,
  onContinue,
}) {
  // Auto-scroll for the chat
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const prevMessages = useRef(messages);
  /**
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  const messagesContainerRef = useRef();
  useEffect(() => {
    if (prevMessages.current !== messages) {
      // @ts-ignore
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
    prevMessages.current = messages;
  }, [messages]);

  const [inputMode, setInputMode] = useState("message");

  const waitingOnProposal = !!onAccept || !!onReject;
  const waitingOnNoDeal = !!onEnd || !!onContinue;

  return (
    <div className="w-full h-full px-2 py-2 pointer-events-auto flex flex-col justify-end ">
      <div className="rounded-2xl outline outline-2 outline-gray-300 pb-2 flex flex-col font-mono bg-white/95 max-h-full">
        <div className="overflow-auto px-2 pb-2" ref={messagesContainerRef}>
          <Messages messages={messages} instructions={instructions} />
        </div>
        <div className="px-2">
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
          {!waitingOnOtherPlayer &&
            !waitingOnNoDeal &&
            !waitingOnProposal &&
            (inputMode === "message" ? (
              <div className="text-sm pl-12 pt-2 text-gray-500">
                <span>When you're ready </span>
                <button
                  className="border border-green-500 text-green-500 px-2 py-1 rounded-md text-xs"
                  onClick={() => setInputMode("proposal")}
                >
                  Propose a deal
                </button>
                {messages.length > 0 && (
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
              <div className="text-sm pl-12 pt-2 text-gray-500">
                <span>If you've changed your mind </span>
                <button
                  className="border border-blue-500 text-blue-500 px-2 py-1 rounded-md text-xs"
                  onClick={() => setInputMode("message")}
                >
                  Keep negotiating
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

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

function ButtonsContainer({ children }) {
  return <div className="grid grid-flow-col gap-x-2 w-full">{children}</div>;
}

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

function Messages({ messages, maxSize = 0, instructions }) {
  return (
    <>
      {instructions && <div className="p-8 text-gray-500">{instructions}</div>}
      {messages.map((message, i) => (
        <React.Fragment key={i}>
          {!!message.text && (
            <TextMessage message={message} maxSize={maxSize} key={message.id} />
          )}
          {message.type === "proposal" && (
            <ProposalMessage message={message} key={message.id} />
          )}
          {message.type === "no-deal" && (
            <NoDealMessage message={message} key={message.id} />
          )}
        </React.Fragment>
      ))}
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
  /**
   * @type {React.MutableRefObject<HTMLTextAreaElement>}
   */
  const textAreaRef = useRef();
  /**
   * @type {React.MutableRefObject<HTMLFormElement>}
   */
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
  /**
   * @type {React.MutableRefObject<HTMLInputElement>}
   */
  const inputRef = useRef();
  /**
   * @type {React.MutableRefObject<HTMLFormElement>}
   */
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
