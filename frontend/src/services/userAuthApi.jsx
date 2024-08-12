import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const userAuthApi = createApi({
    reducerPath: 'userAuthApi',
    baseQuery: fetchBaseQuery('http://127.0.0.1:8000/api')
    
})