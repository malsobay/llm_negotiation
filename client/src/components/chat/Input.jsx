// @ts-check
import React, { useLayoutEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Modal } from "../Modal";

export function InputBox({
  playerId,
  onNewMessage,
  disabled,
  placeholder = "Negociate...",
}) {
  return (
    <div className="flex items-start space-x-4 pb-2">
      <div className="w-6 shrink-0">
        <Avatar index={0} playerId={playerId} />
      </div>
      <div className="w-full">
        <MessageInput
          onNewMessage={onNewMessage}
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

const inputClasses =
  "ring-none text-md peer w-full resize-none " +
  "rounded-md border-none bg-gray-50 px-2 py-1 pr-0 " +
  "leading-snug text-gray-600 ring-1 ring-inset " +
  "ring-gray-500/10 placeholder:text-gray-300 focus:ring-gray-500/50";
const disabledClasses = "cursor-not-allowed opacity-50";

function MessageInput({ onNewMessage, disabled, placeholder }) {
  /** @type {React.MutableRefObject<HTMLTextAreaElement>} */
  const textAreaRef = useRef();
  /** @type {React.MutableRefObject<HTMLFormElement>} */
  const formRef = useRef();

  const [value, setValue] = useState("");

  // Resize to text for the text input area
  function resize() {
    textAreaRef.current.style.height = "inherit";
    textAreaRef.current.style.height = `${Math.min(
      textAreaRef.current.scrollHeight,
      200
    )}px`;
  }

  function handleOnChange(e) {
    setValue(e.target.value);
    resize();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (value.length > 1024) {
      alert("Max message length is 1024");

      return;
    }

    onNewMessage(value);

    setValue("");
    resize();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && e.shiftKey === false && e.metaKey === false) {
      e.preventDefault();
      formRef.current.requestSubmit();
    }
  }

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
            className={`${inputClasses} ${disabled ? disabledClasses : ""}`}
            placeholder={placeholder}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            value={value}
            ref={textAreaRef}
            name="text"
          />

          <SendButton disabled={value.trim().length === 0} />
        </div>
      </fieldset>
    </form>
  );
}

function SendButton({ disabled }) {
  return (
    <Button
      type="submit"
      className="mt-[1px]"
      variant={"secondary"}
      disabled={disabled}
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
  );
}
