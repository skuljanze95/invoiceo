import * as React from "react";

import { Input } from "@/components/ui/input";

interface Props {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

export const DebouncedInput = React.forwardRef<
  HTMLInputElement,
  Props & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">
>(({ debounce = 300, onChange, value: initialValue, ...props }, ref) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <Input
      ref={ref}
      {...props}
      onChange={(e) => setValue(e.target.value)}
      value={value}
    />
  );
});

DebouncedInput.displayName = "DebouncedInput";
