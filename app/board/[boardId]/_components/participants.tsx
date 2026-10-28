"use client";

import { useOthers, useSelf } from "@liveblocks/react";
import { UserAvatar } from "./use-avatar";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_USERS = 2;

export const Participants = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > MAX_SHOWN_USERS;
        
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {
                    return (
                        <UserAvatar 
                            borderColor={connectionIdToColor(connectionId)}
                            key={connectionId}
                            src={info?.picture}
                            name={info?.name}
                            fallback={info?.name?.[0] || "T"}
                        />
                    );
                })}

                {currentUser && (
                    <UserAvatar 
                        borderColor={connectionIdToColor(currentUser.
                        connectionId)}
                        src={currentUser.info?.picture}
                        name={`${currentUser.info?.name} (You)`}
                        fallback={currentUser.info?.name?.[0] || "T"}
                    />
                )}

                {hasMoreUsers && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                        +{users.length - MAX_SHOWN_USERS}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ParticipantsSkeleton = () => {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
    );
};