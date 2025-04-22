import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

export const BaseMessage = z.object({
    text: z.string().trim().nonempty().max(256)
});
export const Message = z.object({
    id: z.number().int().positive().readonly()
}).and(BaseMessage)

export type BaseMessage = z.infer<typeof BaseMessage>
export type Message = z.infer<typeof Message>

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    tagTypes: ['Message'],
    endpoints: (builder) => ({
        getMessages: builder.query<Message[], void>({
            query: () => 'messages',
            providesTags: result =>
                result
                    ?
                    [
                        ...result.map(({ id }) => ({ type: 'Message', id }) as const),
                        { type: 'Message', id: 'LIST' },
                    ]
                    :
                    [{ type: 'Message', id: 'LIST' }],
        }),
        getMessageById: builder.query<Message, number>({
            query: (id) => ({ url: `messages/${id}` }),
            providesTags: (result, error, id) => [{ type: 'Message', id }]
        }),
        createMessage: builder.mutation<Message, BaseMessage>({
            query: message => ({
                url: 'messages',
                method: 'POST',
                body: message
            }),
            invalidatesTags: [{ type: 'Message', id: 'LIST' }]
        }),
        updateMessage: builder.mutation<Message, Message>({
            query: ({ id, ...properties }) => ({
                url: `messages/${id}`,
                method: 'PATCH',
                body: properties
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Message', id }]
        }),
        deleteMessage: builder.mutation<'', number>({
            query: id => ({
                url: `messages/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Message', id }]
        })
    })
})

export const {
    useGetMessagesQuery,
    useGetMessageByIdQuery,
    useUpdateMessageMutation,
    useCreateMessageMutation,
    useDeleteMessageMutation
} = messageApi