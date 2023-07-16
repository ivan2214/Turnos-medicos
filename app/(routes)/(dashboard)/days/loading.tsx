import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const loading = (props: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center py-5">
      <Loader2 className="mr-2 h-24 w-24 animate-spin" />
    </div>
  );
};

export default loading;
