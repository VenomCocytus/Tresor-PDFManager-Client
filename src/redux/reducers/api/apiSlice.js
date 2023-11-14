import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_SERVER_DOMAIN,
	// prepareHeaders: (headers, { getState }) => {
	// 	const token = getState().auth.token;
	// 	if (token) {
	// 		headers.set("Authorization", `Bearer ${token}`);
	// 	}
	// 	return headers;
	// },

	// prepareHeaders: (headers) => {
	// 	return headers;
	// },
});

export const apiSlice = createApi({
	baseQuery,
	endpoints: (builder) => ({}),
});
