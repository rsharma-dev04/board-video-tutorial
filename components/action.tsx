"use client";

import type { ComponentProps, ReactElement } from "react";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmModal } from "@/components/confirm-model";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionsProps {
  children: ReactElement;
  side?: ComponentProps<typeof DropdownMenuContent>["side"];
  sideOffset?: ComponentProps<typeof DropdownMenuContent>["sideOffset"];
  nativeButton?: boolean;
  id: string;
  title: string;
}

export const Actions = ({ children, side, sideOffset, nativeButton = true, id, title }: ActionsProps) => {
  const { onOpen } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/board/${id}`
      );
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const onDelete = async () => {
    if (pending) return;

    try {
      await mutate({ id });
      toast.success("Board deleted");
    } catch {
      toast.error("Failed to delete board");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={children} nativeButton={nativeButton} />

      <DropdownMenuContent onClick={(event) => event.stopPropagation()} side={side} sideOffset={sideOffset} className="w-60 p-3">
        <DropdownMenuItem onClick={onCopyLink} className="cursor-pointer">
          <Link2 className="mr-2 h-4 w-4" />
          Copy board link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onOpen(id, title)} className="cursor-pointer">
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>

        <ConfirmModal header="Delete board?" description="This will delete the board and all of its contents." disabled={pending} onConfirm={onDelete}>
          <button type="button" disabled={pending} className="mt-1 flex w-full cursor-pointer items-center rounded-sm p-1.5 text-left text-sm font-normal hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};