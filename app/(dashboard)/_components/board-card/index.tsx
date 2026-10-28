"use client";

import Link from "next/link";
import Image from "next/image";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/action";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/app/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  title,
  authorName,
  authorId,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();
  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const {
    mutate: onFavorite,
    pending: pendingFavorite,
  } = useApiMutation(api.board.favourite);
  
  const {
    mutate: unFavorite,
    pending: pendingUnfavorite,
  } = useApiMutation(api.board.unfavorite);

  const toggleFavorite = () => {
    if (isFavorite) {
      unFavorite({ id })
        .catch(() => toast.error("Failed to unfavourite"));
    } else {
      onFavorite({ id, orgId })
        .catch(() => toast.error("Failed to favourite"));
    }
  };

  return (
    <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden relative bg-amber-50">
      {/* Sirf image aur overlay wala area link hoga */}
      <Link href={`/board/${id}`} className="absolute inset-0 flex flex-col justify-between">
        <div className="relative flex-1">
          <Image 
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
          <Overlay />
        </div>
      </Link>

      {/* Actions (three dots) ko link ke bahar rakha hai taaki conflict na ho */}
      <div className="absolute top-3 right-3 z-10">
        <Actions id={id} title={title} side="right">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-neutral-500/20"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </Actions>
      </div>

      {/* Footer component */}
      <div className="pointer-events-none z-10 mt-auto">
        <div className="pointer-events-auto">
          <Footer
            isFavorite={isFavorite}
            title={title}
            authorLabel={authorLabel}
            createdAtLabel={createdAtLabel}
            onClick={toggleFavorite}
            disabled={pendingFavorite || pendingUnfavorite}
          />
        </div>
      </div>
    </div>
  );
};

BoardCard.Skeleton = function BoardcardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};