"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Message } from "@/services/message";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import DeleteConfirmation from "./delete-confirmation";
import MessagePopup from "./message-popup";

export default function Actions({ message }: { message: Message }) {
    const [popupOpen, setPopupOpen] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onSelect={() => {
                            setPopupOpen(true)
                        }}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DeleteConfirmation
                        id={message.id}
                        trigger={
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                Delete
                            </DropdownMenuItem>
                        }
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {popupOpen && (
                <MessagePopup
                    id={message.id}
                    open={popupOpen}
                    setOpen={(open) => setPopupOpen(open)}
                />
            )}
        </>
    )
}
