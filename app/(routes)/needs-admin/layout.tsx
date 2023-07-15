import getCurrentUser from "@/actions/getCurrentUser";
import React from "react";

const layoutNeedAdmin = ({ children }: { children: React.ReactNode }) => {
  return <div className="container">{children}</div>;
};

export default layoutNeedAdmin;
