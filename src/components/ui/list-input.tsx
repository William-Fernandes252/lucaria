"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type React from "react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";

type ListInputProps = React.ComponentPropsWithRef<"input"> & {
  value: readonly string[];
  onChange: (value: string[]) => void;
};

export default function ListInput({
  value,
  onChange,
  ...props
}: ListInputProps) {
  const [inputValue, setInputValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.autoFocus) {
      ref.current?.focus();
    }
  }, [props.autoFocus]);

  function addItem(item: string) {
    if (item.trim() !== "" && !value.includes(item.trim())) {
      onChange([...value, item.trim()]);
      setInputValue("");
      ref.current?.focus();
    }
  }

  function removeItem(indexToRemove: number) {
    const newItems = value.filter((_, index) => index !== indexToRemove);
    onChange(newItems);
    ref.current?.focus();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addItem(inputValue);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((item, index) => (
          <div
            key={String(item)}
            className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-md"
          >
            <span>{String(item)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-primary-foreground hover:text-primary"
              onClick={() => removeItem(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          ref={ref}
          type="text"
          placeholder="Enter keywords"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          {...props}
          className="flex-grow"
        />
        <Button onClick={() => addItem(inputValue)}>Add</Button>
      </div>
    </div>
  );
}
