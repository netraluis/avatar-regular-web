import React, { ChangeEvent, KeyboardEvent } from "react";

export interface TextAreaFormProps {
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  input: string;
  submitMessage: () => void;
  status: string;
}

export interface Option {
  id: string;
  name: string;
  [key: string]: any;
}
