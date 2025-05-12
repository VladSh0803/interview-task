import { Button } from "@/components/ui/button"
import MessagePopup from "./components/message-popup"
import MessageDataTable from "./components/message-data-table"

export default function Messages() {
    return (
        <div className="container mx-auto py-10">
            <div className="bg-white dark:bg-muted rounded-2xl shadow-sm border p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
                    <MessagePopup trigger={<Button>Add message</Button>} />
                </div>
                <MessageDataTable />
            </div>
        </div>
    )
}