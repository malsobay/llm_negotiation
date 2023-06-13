// @ts-check
import React, { useEffect, useRef, useState } from "react";
import { useInterval } from "../../utils";
import { Avatar } from "../Avatar";

export function Messages({
  messages,
  currentPlayerId,
  maxSize = 0,
  typingPlayerId,
}) {
  const otherPlayerTyping = Boolean(typingPlayerId);
  // Auto-scroll for the chat
  /** @type {React.MutableRefObject<any[]>} */
  const prevMessages = useRef(messages);
  /** @type {React.MutableRefObject<boolean>} */
  const prevOtherPlayerTyping = useRef(otherPlayerTyping);
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const messagesContainerRef = useRef();

  // Scroll to bottom of first (re)load
  useEffect(() => {
    // @ts-ignore
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, []);

  // Scroll to bottom on new message or other player typing
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

  return (
    <div ref={messagesContainerRef} className="overflow-y-auto">
      <div className="space-y-2">
        {messages.length > 0 &&
          messages.map((message, i) => (
            <Message message={message} currentPlayerId={currentPlayerId} />
          ))}
        {!!typingPlayerId && <TypingIndicator playerId={typingPlayerId} />}
        {messages.length === 0 && !typingPlayerId && (
          <div>
            <p>No messages yet</p>
          </div>
        )}
      </div>
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
function Message({ message, currentPlayerId, maxSize = 0 }) {
  switch (message.type) {
    case "message":
      return (
        <TextMessage
          currentPlayerId={currentPlayerId}
          message={message}
          maxSize={maxSize}
          key={message.id}
        />
      );

    case "proposal":
      return (
        <ProposalMessage
          message={message}
          key={message.id}
          currentPlayerId={currentPlayerId}
        />
      );

    case "no-deal":
      return (
        <NoDealMessage
          message={message}
          key={message.id}
          currentPlayerId={currentPlayerId}
        />
      );

    default:
      console.error("Unknown message type", message);

      return null;
  }
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

/**
 * @param {{
*   message: import("../useGameMechanics").Message;
*   maxSize?: number;
* }} param0
*/
function TextMessage({ message, currentPlayerId, maxSize }) {
  let sliced = false;
  let text = message.text;
  if (maxSize > 0 && message.text.length > maxSize) {
    text = text.slice(0, maxSize);
    sliced = true;
  }

  return (
    <MessageLine message={message} currentPlayerId={currentPlayerId}>
      {text}
      {sliced ? <span>[...]</span> : ""}
    </MessageLine>
  );
}

/**
 * @param {{
*   message: import("../useGameMechanics").Message;
* }} param0
*/
export function ProposalMessage({
  message,
  currentPlayerId,
  hidePending = false,
}) {
  return (
    <MessageLine message={message} currentPlayerId={currentPlayerId}>
      <div>
        <span className="italic">Proposed a deal: </span>
        <span className="font-bold">
          {Intl.NumberFormat([], {
            style: "currency",
            currency: "USD",
          }).format(message.proposal)}
        </span>
      </div>
      <div>
        {message.proposalStatus === "accepted" && (
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
            Accepted
          </span>
        )}
        {message.proposalStatus === "rejected" && (
          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            Rejected
          </span>
        )}

        {!hidePending &&
          message.proposalStatus !== "rejected" &&
          message.proposalStatus !== "accepted" && (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              Pending
            </span>
          )}
      </div>
    </MessageLine>
  );
}

/**
 * @param {{
*   message: import("../useGameMechanics").Message;
* }} param0
*/
function NoDealMessage({ message, currentPlayerId }) {
  const unilateral = message.noDealStatus === "unilateral";
  return (
    <MessageLine message={message} currentPlayerId={currentPlayerId}>
      <div className="italic">
        {unilateral ? "Ended without a deal" : "Proposed to end without a deal"}
      </div>

      {!unilateral && (
        <div>
          {message.noDealStatus === "continued" && (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
              Continued negotiations
            </span>
          )}
          {message.noDealStatus === "ended" && (
            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              Ended with no deal
            </span>
          )}

          {message.noDealStatus !== "continued" &&
            message.noDealStatus !== "ended" && (
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Pending
              </span>
            )}
        </div>
      )}
    </MessageLine>
  );
}

function MessageLine({ message, currentPlayerId, children }) {
  const self = message.playerId == currentPlayerId;

  return (
    <div className="flex items-start space-x-4">
      <div className="mt-.5 w-6 shrink-0">
        <Avatar index={self ? 0 : 1} playerId={message.playerId} />
      </div>
      <div className={self ? "text-bluegray-500" : "text-gray-700"}>
        <div className="font-bold">{self ? "You" : "Opponent"}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
