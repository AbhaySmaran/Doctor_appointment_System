import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://127.0.0.1:8000/api'}),
    endpoints: (builder)=>({
        rgisterUser: builder.Mutation({
            return: {
                query: ('/register/user/'),
                
            }
        })
    })
})