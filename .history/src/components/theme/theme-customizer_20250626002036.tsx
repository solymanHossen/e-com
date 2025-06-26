// Theme customization panel
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { themePresets } from "@/lib/themes/presets";
import { useThemeStore } from "@/lib/themes/store";
import { Download, Palette } from "lucide-react";
import { useState } from "react";

export function ThemeCustomizer() {
  const {
    currentTheme,
    customThemes,
    mode,
    customizations,
    setTheme,
    setMode,
    updateCustomizations,
    resetCustomizations,
    saveThemeToAPI,
  } = useThemeStore();

  const [isOpen, setIsOpen] = useState(false);

  const handleSaveTheme = async () => {
    const customTheme = {
      ...currentTheme,
      id: `custom-${Date.now()}`,
      name: `Custom ${currentTheme.name}`,
      category: "custom" as const,
      // Apply customizations to the theme
      colors: {
        ...currentTheme.colors,
        light: {
          ...currentTheme.colors.light,
          ...(customizations.primaryColor && {
            primary: customizations.primaryColor,
          }),
        },
        dark: {
          ...currentTheme.colors.dark,
          ...(customizations.primaryColor && {
            primary: customizations.primaryColor,
          }),
        },
      },
      fonts: {
        ...currentTheme.fonts,
        ...(customizations.fontFamily && {
          sans: [customizations.fontFamily, ...currentTheme.fonts.sans],
        }),
      },
      spacing: {
        ...currentTheme.spacing,
        scale: customizations.spacing || currentTheme.spacing.scale,
      },
      animations: {
        ...currentTheme.animations,
        enabled: customizations.animations !== false,
      },
    };

    await saveThemeToAPI(customTheme);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg"
      >
        <Palette className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-background border-l shadow-lg overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Theme Customizer</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ×
              </Button>
            </div>

            <Tabs defaultValue="presets" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="presets">Themes</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Type</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
              </TabsList>

              <TabsContent value="presets" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme Mode</Label>
                  <Select
                    value={mode}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setMode(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Preset Themes
                  </Label>
                  <div className="space-y-2">
                    {themePresets.map((theme) => (
                      <Card
                        key={theme.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          currentTheme.id === theme.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setTheme(theme)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">
                                {theme.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {theme.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {theme.category}
                            </Badge>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{
                                backgroundColor: theme.colors.light.primary,
                              }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{
                                backgroundColor: theme.colors.light.secondary,
                              }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{
                                backgroundColor: theme.colors.light.accent,
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {customThemes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Custom Themes
                    </Label>
                    <div className="space-y-2">
                      {customThemes.map((theme) => (
                        <Card
                          key={theme.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            currentTheme.id === theme.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() => setTheme(theme)}
                        >
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm">
                              {theme.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {theme.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="colors" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Primary Color</Label>
                  <Input
                    type="color"
                    value={
                      customizations.primaryColor ||
                      currentTheme.colors.light.primary
                    }
                    onChange={(e) =>
                      updateCustomizations({ primaryColor: e.target.value })
                    }
                    className="h-10"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateCustomizations({ primaryColor: undefined })
                  }
                >
                  Reset Primary Color
                </Button>
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Font Family</Label>
                  <Select
                    value={customizations.fontFamily || ""}
                    onValueChange={(value) =>
                      updateCustomizations({ fontFamily: value || undefined })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Playfair Display">
                        Playfair Display
                      </SelectItem>
                      <SelectItem value="Nunito">Nunito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Spacing Scale</Label>
                  <Slider
                    value={[customizations.spacing || 1]}
                    onValueChange={([value]) =>
                      updateCustomizations({ spacing: value })
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {((customizations.spacing || 1) * 100).toFixed(0)}%
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Border Radius</Label>
                  <Select
                    value={customizations.borderRadius || "default"}
                    onValueChange={(value) =>
                      updateCustomizations({
                        borderRadius: value === "default" ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Animations</Label>
                  <Switch
                    checked={customizations.animations !== false}
                    onCheckedChange={(checked) =>
                      updateCustomizations({ animations: checked })
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 mt-6">
              <Button size="sm" onClick={handleSaveTheme} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Save Theme
              </Button>
              <Button size="sm" variant="outline" onClick={resetCustomizations}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
