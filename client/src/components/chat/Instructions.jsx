// @ts-check
import React, { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Modal } from "../Modal";

export function Instructions({ instructions }) {
  const [shown, setShown] = useState(false);
  return (
    <>
      {shown && (
        <Modal onClickOut={() => setShown(false)} showCloseButton>
          <div className="prose prose-bluegray max-w-prose rounded-lg bg-gray-50 px-6 py-2 shadow-sm ring-1 ring-gray-900/5">
            <ReactMarkdown>{instructions}</ReactMarkdown>
          </div>
        </Modal>
      )}
      <button
        className="bg-transparent text-gray-500"
        onClick={() => setShown(!shown)}
      >
        Show instructions
      </button>
    </>
  );
}
