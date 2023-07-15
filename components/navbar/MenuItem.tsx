"use client";

import { Label } from "../ui/label";

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <Label
      onClick={onClick}
      className="
        block 
        w-full 
        cursor-pointer 
        px-5
        py-3
        font-semibold
        transition
        text-primary-foreground
        hover:text-gray-500
      "
    >
      {label}
    </Label>
  );
};

export default MenuItem;
