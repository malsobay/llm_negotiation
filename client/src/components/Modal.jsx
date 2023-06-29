import React, { useEffect, useRef } from "react";
import "./Modal.css";

export const Modal = ({ children, onClickOut, showCloseButton = false }) => {
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  const handleOutsideClick = (e) => {
    if (
      typeof onClickOut === "function" &&
      e.currentTarget.id === "modal-container"
    ) {
      onClickOut();
    }
  };

  return (
    <dialog ref={dialog}>
      <div
        className="fixed inset-0 left-0 z-50 flex h-screen w-screen items-center justify-end pr-90 bg-black/60"
        id="modal-container"
        onClick={handleOutsideClick}
      >
        <div
          id="modal"
          onClick={(e) => e.stopPropagation()}
          className="relative rounded bg-white p-8 shadow-lg"
        >
          {children}

          {showCloseButton && (
            <button
              className="absolute -right-4 -top-4 inline-flex items-center rounded-full bg-gray-200 p-2 text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClickOut}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};
