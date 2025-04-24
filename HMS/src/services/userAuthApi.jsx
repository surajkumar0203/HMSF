import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/' }),

    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => {
                return {
                    url: 'account/login/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),

        forgotPassword: builder.mutation({
            query: (user) => {
                return {
                    url: 'account/forgotpin/',
                    method: 'POST',
                    body: user,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),

        changePassword: builder.mutation({
            query: ({form,uid,token}) => {
                return {
                    url: `account/resetpassword/${uid}/${token}/`,
                    method: 'POST',
                    body: form,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
    }),

})

export const { useLoginMutation,useForgotPasswordMutation,useChangePasswordMutation } = userAuthApi 