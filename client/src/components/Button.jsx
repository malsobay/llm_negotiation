import React from "react";

const base =
  "inline-flex items-center px-3 py-2 border text-sm font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary:
    "border-transparent text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
  secondary:
    "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500",
  disabled:
    "border-gray-200 text-gray-400 bg-white opacity-50 cursor-not-allowed",
  positive:
    "border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
  negative:
    "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

export function Button({
  children,
  onClick = null,
  className = "",
  variant = "primary",
  type = "button",
  autoFocus = false,
  full = false,
  disabled = false,
  icon = null,
}) {
  const vari = disabled
    ? variants.disabled
    : variants[variant] || variants.primary;
  const wFull = full ? "w-full flex justify-center" : "";
  const cn = `${base} ${vari} ${wFull} ${className}`;

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn}
      autoFocus={autoFocus}
    >
      {icon ? <span className="mr-2 h-4 w-4">{icon}</span> : null}
      {children}
    </button>
  );
}
