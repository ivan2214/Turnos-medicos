"use client";

import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import AlertModal from "@/components/modals/alert-modal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TimeColumn } from "./columns";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

interface CellActionProps {
  data: TimeColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const deleteTime = trpc.deleteTime.useMutation();

  const onConfirm = async () => {
    try {
      setLoading(true);
      deleteTime.mutate(
        {
          timeId: data.id,
        },
        {
          onSuccess(data, variables, context) {
            toast({
              title: "Time deleted.",
              description: "Time Deleted successfully.",
            });
          },
          onError(error, variables, context) {
            toast({
              title: "Something went wrong.",
              description: error.message,
            });
          },
        },
      );
      setTimeout(() => {
        router.refresh();
      }, 600);

      router.push(`/times`);
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "StartTime ID copied to clipboard.",
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/times/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
