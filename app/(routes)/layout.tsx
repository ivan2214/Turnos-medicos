import React from "react";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto h-full max-w-screen-2xl px-10 py-5">{children}</div>
  );
}
