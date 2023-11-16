import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_SERVER_DOMAIN,
});

export const apiSlice = createApi({
	baseQuery,
	endpoints: (builder) => ({}),
});
