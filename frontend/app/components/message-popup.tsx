"use client"

import { BaseMessage, Message, useCreateMessageMutation, useGetMessageByIdQuery, useUpdateMessageMutation } from "@/services/message"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

type WithTrigger = { id?: number; trigger: React.ReactNode }
type Controlled = { id?: number; open: boolean; setOpen: (open: boolean) => void }

type MessagePopupProps = WithTrigger | Controlled

function isWithTrigger(props: MessagePopupProps): props is WithTrigger {
    return "trigger" in props
}

export default function MessagePopup(props: MessagePopupProps) {
    const { id } = props
    const [internalOpen, setInternalOpen] = useState(false)
    const open = isWithTrigger(props) ? internalOpen : props.open
    const setOpen = isWithTrigger(props) ? setInternalOpen : props.setOpen

    const { data, isLoading, isUninitialized } = useGetMessageByIdQuery(id ?? skipToken)
    const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation()
    const [createMessage, { isLoading: isCreating }] = useCreateMessageMutation()
    const form = useForm({
        resolver: zodResolver(isUninitialized ? BaseMessage : Message),
        defaultValues: {
            text: ""
        }
    })

    useEffect(() => {
        if (open) {
            if (data) {
                form.reset(data)
            } else {
                form.reset()
            }
        }
    }, [data, form, open])

    const isBusy = isCreating || isUpdating

    function onSubmit(values: Message): void
    function onSubmit(values: BaseMessage): void
    function onSubmit(values: Message | BaseMessage) {
        const mutation = isUninitialized ? () => createMessage(values as BaseMessage) : () => updateMessage(values as Message)
        mutation().then(() => {
            setOpen(false)
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next)
            }}
        >
            {isWithTrigger(props) && <DialogTrigger asChild>{props.trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>{isUninitialized ? 'Create message' : 'Edit message'}</DialogTitle>
                </DialogHeader>
                {isLoading
                    ? <Spinner />
                    : <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter message content" disabled={isBusy} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isBusy && (
                                <div className="flex justify-center pt-2">
                                    <Spinner />
                                </div>
                            )}
                            <DialogFooter>
                                <Button disabled={isBusy} type="submit">
                                    {isUninitialized ? 'Create' : 'Save changes'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>}
            </DialogContent>
        </Dialog>
    )
}
