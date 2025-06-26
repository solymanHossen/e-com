export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  category: "default" | "ecommerce" | "seasonal" | "brand" | "custom";
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: {
    sans: string[];
    mono: string[];
    heading?: string[];
  };
  spacing: {
    scale: number;
    containerPadding: string;
    sectionSpacing: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: string;
    easing: string;
    enabled: boolean;
  };
  components: {
    button: ComponentTheme;
    card: ComponentTheme;
    input: ComponentTheme;
    header: ComponentTheme;
    footer: ComponentTheme;
  };
  ecommerce: {
    productCard: {
      hoverEffect: "scale" | "lift" | "glow" | "none";
      badgeStyle: "modern" | "classic" | "minimal";
      imageAspectRatio: string;
    };
    pricing: {
      currency: string;
      showOriginalPrice: boolean;
      discountStyle: "percentage" | "amount" | "both";
    };
    cart: {
      style: "sidebar" | "dropdown" | "page";
      animation: "slide" | "fade" | "bounce";
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentTheme {
  variants: Record<string, any>;
  defaultProps: Record<string, any>;
  styles: Record<string, string>;
}

export interface ThemePreset {
  id: string;
  name: string;
  preview: string;
  config: Partial<ThemeConfig>;
}
