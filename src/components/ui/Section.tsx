import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Section({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-20 px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto max-w-7xl", className)}
      {...props}
    />
  );
}

export function SectionHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
        className
      )}
      {...props}
    />
  );
}

export function SectionSubheading({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-4 max-w-2xl text-lg text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
