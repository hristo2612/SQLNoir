"use client";

import Link, { type LinkProps } from "next/link";
import { track } from "@vercel/analytics/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
    event: string;
    eventProps?: Record<string, string | number | boolean | null>;
    children: ReactNode;
  };

export function TrackedLink({
  event,
  eventProps,
  children,
  className,
  ...rest
}: TrackedLinkProps) {
  return (
    <Link
      {...rest}
      className={className}
      onClick={(e) => {
        if (rest.onClick) {
          rest.onClick(e);
        }
        track(event, eventProps ?? {});
      }}
    >
      {children}
    </Link>
  );
}
