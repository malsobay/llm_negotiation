// @ts-check
import React from "react";
import ReactMarkdown from "react-markdown";

const btnClass =
  "border-0.5 flex w-full items-center justify-center rounded border-gray-300 py-1 leading-tight hover:bg-teal-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-100";

const QuestionRadioGroup = ({
  question,
  options,
  value,
  onChange,
  required = false,
  withLabelKey = false,
}) => {
  const opts = Object.entries(options);
  const labels = opts.map(([key, label]) => label).filter((v) => v);

  return (
    <fieldset>
      <legend className="min-h-20 flex items-end text-base font-medium text-gray-900">
        <div>{question}</div>
      </legend>
      <div className="mt-4 flex justify-between gap-x-4">
        {opts.map(([key, label]) => (
          <button
            type="button"
            key={key}
            id={`${question}-${key}`}
            onClick={() => onChange({ target: { value: key } })}
            className={`${btnClass} ${
              key == value
                ? "bg-teal-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {withLabelKey ? key : label}
          </button>
        ))}
      </div>
      {withLabelKey && (
        <div className="min-h-12 mt-4 grid auto-cols-fr grid-flow-col gap-x-4 text-sm text-gray-700">
          {labels.map((label, i) => (
            <label
              key={label}
              htmlFor={`${question}-${label}`}
              className={`flex items-start ${
                i == 0
                  ? "justify-start"
                  : i == labels.length - 1
                  ? "justify-end text-right"
                  : "justify-center text-center"
              }`}
            >
              <ReactMarkdown>{label}</ReactMarkdown>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default QuestionRadioGroup;
