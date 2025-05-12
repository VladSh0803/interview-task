"use client"

import { useDeleteMessageMutation } from "@/services/message";
import { cloneElement, type ReactElement } from "react";

export default function DeleteConfirmation({ id, trigger }: { id: number, trigger: ReactElement }) {
    const [deleteMessage] = useDeleteMessageMutation()

    const onSelect = () => {
        if (confirm(`Are you sure you want to delete message with ID ${id}`)) {
            deleteMessage(id)
        }
    }

    return cloneElement(trigger, { onSelect })
}