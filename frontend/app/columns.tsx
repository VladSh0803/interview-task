import { Message } from "@/services/message"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Actions from "./components/actions"

export const columns: ColumnDef<Message>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue<number>()}</span>,
    },
    {
        accessorKey: "text",
        header: "Text",
        cell: ({ getValue }) => <span className="truncate max-w-[300px]">{getValue<string>()}</span>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            return <Actions message={row.original} />
        },
    },
]