"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ExpandButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  icon: React.ReactNode;
  hoverText: string;
}

export function ExpandButton({
  icon,
  hoverText,
  variant,
  className,
  ...props
}: ExpandButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <motion.div
      className="inline-block"
      initial={false}
      animate={{
        width: isHovered ? "auto" : "40px",
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <Button
        variant={variant}
        className={cn(
          "h-10 w-full flex items-center justify-center overflow-hidden px-0",
          className
        )}
        {...props}
        {...(isDesktop && {
          onMouseEnter: (e) => {
            setIsHovered(true);
            props?.onMouseEnter?.(e);
          },
          onMouseLeave: (e) => {
            setIsHovered(false);
            props?.onMouseLeave?.(e);
          },
          onBlur: (e) => {
            setIsHovered(false);
            props?.onBlur?.(e);
          },
        })}
      >
        <div className={cn("flex items-center", isHovered ? "pr-3" : "")}>
          <div className="flex items-center justify-center w-10">{icon}</div>
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              width: isHovered ? "auto" : 0,
            }}
            transition={{
              opacity: {
                duration: 0.2,
              },
              width: { duration: 0.2 },
            }}
            className="whitespace-nowrap font-medium"
          >
            {hoverText}
          </motion.span>
        </div>
      </Button>
    </motion.div>
  );
}
