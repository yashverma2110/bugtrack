import React, { useState, useEffect } from "react";
import "./styles.css";

interface inputProps {
  name: string;
  type?: string;
  required?: boolean;
  label: string;
  defaultValue?: any;
  validator?: (value: any) => boolean;
  onError?: () => void;
  onSuccess?: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  label = "label",
  name,
  type = "text",
  required = false,
  defaultValue,
  validator,
  onError,
  onSuccess,
  onChange,
}: inputProps) => {
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (required) {
      onError && onError();
    }
  }, [required, onError]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (validator && !validator(event.target.value)) {
      setValidationError("Invalid " + name);
      onError && onError();
    } else {
      setValidationError("");
      onSuccess && onSuccess();
    }
    onChange(event);
  };

  return (
    <div className="input-container">
      <label htmlFor={name}>
        {label} <span style={{ color: "red" }}>{required && "*"}</span>
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
      <div className="input-error">{validationError}</div>
    </div>
  );
};

export default Input;
