import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: async (headers, { getState }) => {
    // Get token from NextAuth session
    const session = await getSession();

    if (session?.accessToken) {
      headers.set("authorization", `Bearer ${session.accessToken}`);
    }

    headers.set("content-type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle token refresh or redirect to login
    console.log("Unauthorized - redirecting to login");
    // You can dispatch a logout action here
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Order", "Cart"],
  endpoints: () => ({}),
});
