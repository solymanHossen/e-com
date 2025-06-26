import { baseApi } from "./base-api";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    variant?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  couponCode?: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/orders",
        params: { page, limit },
      }),
      providesTags: ["Order"],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    updateOrderStatus: builder.mutation<
      Order,
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    cancelOrder: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = ordersApi;
