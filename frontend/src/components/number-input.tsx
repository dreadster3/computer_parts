import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

const NumberInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Input
        className={cn(
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
        type="number"
        ref={ref}
        {...props}
      />
      <div className="absolute right-0.5 top-0.5 flex gap-0.5">
        <Button variant="outline" size="sm">
          <MinusIcon />
        </Button>
        <Button variant="outline" size="sm">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
});

export default NumberInput;
