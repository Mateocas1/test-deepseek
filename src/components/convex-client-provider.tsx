"use client";

import { ReactNode, useRef } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const convexRef = useRef<ConvexReactClient | null>(null);

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return <>{children}</>;
  }

  if (!convexRef.current) {
    convexRef.current = new ConvexReactClient(url);
  }

  return (
    <ConvexProviderWithClerk client={convexRef.current} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
