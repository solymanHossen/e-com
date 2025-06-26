import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals
  modals: Record<string, boolean>;

  // Loading states
  loading: Record<string, boolean>;

  // Search
  searchOpen: boolean;
  searchQuery: string;

  // Filters
  filtersOpen: boolean;
  activeFilters: Record<string, any>;

  // Layout
  layout: "grid" | "list";

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;

  setLoading: (key: string, loading: boolean) => void;

  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;

  setFiltersOpen: (open: boolean) => void;
  setActiveFilters: (filters: Record<string, any>) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;

  setLayout: (layout: "grid" | "list") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      sidebarCollapsed: false,
      modals: {},
      loading: {},
      searchOpen: false,
      searchQuery: "",
      filtersOpen: false,
      activeFilters: {},
      layout: "grid",

      // Sidebar actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Modal actions
      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),
      toggleModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: !state.modals[modalId] },
        })),

      // Loading actions
      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),

      // Search actions
      setSearchOpen: (open) => set({ searchOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Filter actions
      setFiltersOpen: (open) => set({ filtersOpen: open }),
      setActiveFilters: (filters) => set({ activeFilters: filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, [key]: value },
        })),
      clearFilters: () => set({ activeFilters: {} }),

      // Layout actions
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        layout: state.layout,
        activeFilters: state.activeFilters,
      }),
    }
  )
);
