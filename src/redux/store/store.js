import { configureStore } from "@reduxjs/toolkit";

/** call reducers */
// import userReducer from "../reducers/userReducer";
import fileReducer from "../reducers/auth/authSlice";
import { apiSlice } from "../reducers/api/apiSlice";

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: fileReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true,
});

export default store;
