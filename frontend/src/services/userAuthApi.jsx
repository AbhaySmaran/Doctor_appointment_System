import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: fetchBaseQuery({baseUrl: '${url}/api'}),
    endpoints: (builder)=>({
        rgisterUser: builder.Mutation({
            return: {
                query: ('/register/user/'),
                
            }
        })
    })
})