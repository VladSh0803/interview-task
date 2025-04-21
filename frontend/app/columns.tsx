"use client"

import { Message } from "@/services/message"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Message>[] = [
    {
        accessorKey: "id",
        header: "ID"
    },
    {
        accessorKey: "text",
        header: "Text"
    }
]