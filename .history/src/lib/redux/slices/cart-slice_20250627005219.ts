import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  maxQuantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>
    ) => {
      const { quantity = 1, ...item } = action.payload;
      const existingItem = state.items.find(
        (i) => i.productId === item.productId && i.variant === item.variant
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          item.maxQuantity
        );
        existingItem.quantity = newQuantity;
      } else {
        state.items.push({
          ...item,
          quantity: Math.min(quantity, item.maxQuantity),
        });
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeItem: (
      state,
      action: PayloadAction<{ productId: string; variant?: string }>
    ) => {
      const { productId, variant } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      );
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        variant?: string;
        quantity: number;
      }>
    ) => {
      const { productId, variant, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.productId === productId && i.variant === variant
      );

      if (item) {
        item.quantity = Math.min(Math.max(quantity, 1), item.maxQuantity);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },

    calculateTotals: (state) => {
      state.total = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      state.itemCount = state.items.reduce(
        (count, item) => count + item.quantity,
        0
      );
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
