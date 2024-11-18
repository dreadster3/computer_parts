import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const NumberInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, value, onChange, ...props }, ref) => {
  const [internalValue, _setInternalValue] = useState(
    Number(props.defaultValue || value || 0),
  );

  const countDecimals = (value: number) => {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  };

  const sanitizeValue = (
    value: number | string | readonly string[] | undefined,
  ): number => {
    const decimals = countDecimals(Number(props.step));
    const multiplier = Math.pow(10, decimals);
    let newValue =
      Math.round((Number(value) + Number.EPSILON) * multiplier) / multiplier;

    newValue = Math.min(
      Math.max(newValue, Number(props.min)),
      Number(props.max),
    );

    return newValue;
  };

  const setInternalValue = (
    value: number | string | readonly string[] | undefined,
  ) => {
    _setInternalValue(sanitizeValue(value));
  };

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
  };

  const increment = () => {
    const newValue = sanitizeValue(
      (Number(internalValue) || 0) + (Number(props.step) || 1),
    );
    setInternalValue(newValue);
    onChange?.({
      target: { value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const decrement = () => {
    const newValue = sanitizeValue(
      (Number(internalValue) || 0) - (Number(props.step) || 1),
    );
    setInternalValue(newValue);
    onChange?.({
      target: { value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Input
        className={cn(
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        type="number"
        ref={ref}
        value={internalValue}
        onChange={handleChange}
        {...props}
      />
      <div className="absolute right-0.5 top-0.5 flex gap-0.5">
        <Button
          type="button"
          disabled={internalValue === props.min}
          onClick={decrement}
          variant="outline"
          size="sm"
        >
          <MinusIcon />
        </Button>
        <Button
          type="button"
          disabled={internalValue === props.max}
          onClick={increment}
          variant="outline"
          size="sm"
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
});

export default NumberInput;
