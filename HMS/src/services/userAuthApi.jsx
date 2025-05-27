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

        registerPatient: builder.mutation({
            query: (form) => {
                return {
                    url: `patient/createpatient/`,
                    method: 'POST',
                    body: form,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        activateAccount: builder.query({
            query: ({uid,token}) => {
                return {
                    url: `account/activate/${uid}/${token}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        reSendLink: builder.mutation({
            query: ({user_id,email}) => {
                return {
                    url: `account/resendlink/`,
                    method: 'POST',
                    body: {user_id,email},
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),

        createStaff:builder.query({
            query: () => {
                return {
                    url: `staff/createstaff/`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        createStaffs:builder.mutation({
            query: (form) => {
                return {
                    url: `staff/createstaff/`,
                    method: 'POST',
                    body:form,
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        createPatient:builder.query({
            query: () => {
                return {
                    url: `patient/createpatient/`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        getDoctorRefrence:builder.query({
            query: () => {
                return {
                    url: `staff/showreference/`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            },
        }),
        // next code
        getProfile:builder.query({
            query:({ url,token })=>{
                return {
                    url: url,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization':`Bearer ${token}`
                    }
                }
            }
        }),
        getAppointment:builder.query({
            query:({ url,token })=>{
                return {
                    url: url,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization':`Bearer ${token}`
                    }
                }
            }
        })
        // next code
    }),

})

export const { useLoginMutation,useForgotPasswordMutation,useChangePasswordMutation,useRegisterPatientMutation,useActivateAccountQuery,useReSendLinkMutation,useCreateStaffQuery,useCreateStaffsMutation,useCreatePatientQuery,useGetDoctorRefrenceQuery,useGetProfileQuery,useGetAppointmentQuery } = userAuthApi 