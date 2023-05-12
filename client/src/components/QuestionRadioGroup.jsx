// @ts-check
import React, { useMemo } from "react";

/** @param {{ text: string }} param0 */
const FormattedLabel = ({ text }) => {
  const parsed = useMemo(() => {
    return text.split(/(_\w+_)/);
  }, [text]);

  return (
    <>
      {parsed.map((segment) => {
        if (segment.startsWith("_") && segment.endsWith("_")) {
          return <span className="font-bold">{segment.slice(1, -1)}</span>;
        } else {
          return segment;
        }
      })}
    </>
  );
};

const QuestionRadioGroup = ({
  question,
  options,
  value,
  onChange,
  required = false,
  withLabelKey = false,
}) => {
  return (
    <fieldset>
      <legend className="text-base font-medium text-gray-900">
        {question}
      </legend>
      <div className="mt-4 grid grid-flow-col auto-cols-fr gap-x-4">
        {Object.entries(options).map(([key, label]) => (
          <div
            key={key}
            className="flex flex-col justify-between items-center space-y-2"
          >
            <label
              htmlFor={`${question}-${key}`}
              className="block text-sm text-gray-700 text-center"
            >
              {withLabelKey && (
                <>
                  ({key})<br />
                </>
              )}
              <FormattedLabel text={label} />
            </label>
            <input
              id={`${question}-${key}`}
              name={question}
              value={key}
              checked={value === key}
              onChange={onChange}
              type="radio"
              className="focus:ring-empirica-500 h-4 w-4 text-empirica-600 border-gray-300"
              required={required}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default QuestionRadioGroup;
