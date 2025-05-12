"use client"

import Spinner from "@/components/ui/spinner"
import Error from "@/components/ui/error"
import { useGetMessagesQuery } from "@/services/message"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "../columns"

export default function MessageDataTable() {
    const { isError, isLoading, data } = useGetMessagesQuery()

    if (isLoading) return <Spinner />
    if (isError || !data) return <Error />

    return <DataTable columns={columns} data={data} />
}