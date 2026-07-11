import type { Preview } from "@storybook/react";
import type { CSSProperties } from "react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, { globals }) => {
      const isDark = globals.theme === "dark";

      return (
        <div
          className={isDark ? "dark" : undefined}
          style={
            {
              "--font-sans": "Geist, ui-sans-serif, system-ui, sans-serif",
              "--font-geist-mono": "Geist Mono, ui-monospace, monospace",
            } as CSSProperties
          }
        >
          <div className="bg-background p-6 font-sans text-foreground antialiased">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
