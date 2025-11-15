import React, { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Input({ label, type = "text", options = [], className = "", showToggle = true, ...props }, ref) {
  const id = useId();
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1 text-black dark:text-white" htmlFor={id}>
          {label}
        </label>
      )}

      {type === "select" ? (
        <select
          id={id}
          ref={ref}
          className={`px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-600 duration-200 border border-gray-200 dark:border-gray-600 w-full ${className}`}
          defaultValue=""
          {...props}
        >
          <option value="" disabled>
            Select your role
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={id}
            type={type === "password" && show ? "text" : type}
            ref={ref}
            className={`px-3 py-2 ${type === "password" ? "pr-10" : ""} rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus:bg-gray-50 dark:focus:bg-gray-600 duration-200 border border-gray-200 dark:border-gray-600 w-full ${className}`}
            {...props}
          />
          {type === "password" && showToggle && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute inset-y-0 right-2 h-full flex items-center p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
            >
              {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(Input);
