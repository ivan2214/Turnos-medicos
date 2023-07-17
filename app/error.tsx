"use client";

import { useEffect } from "react";

import EmptyState from "@/components/empty-state";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <EmptyState title="Ups!" subtitle="Algo salio mal!" />;
};

export default ErrorState;
