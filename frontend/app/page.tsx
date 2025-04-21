"use client"

import { DataTable } from "@/components/ui/data-table"
import Spinner from "@/components/ui/spinner"
import { useGetMessagesQuery } from "@/services/message"
import { columns } from "@/app/columns"

export default function Messages() {
    const { isError, isLoading, data, error } = useGetMessagesQuery()

    if (isLoading) return <Spinner />
    if (isError) {
        console.log(error)
        return "Bla"
    }
    if (isError || !data) return "So"

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}