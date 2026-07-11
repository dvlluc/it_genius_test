import type { Meta, StoryObj } from "@storybook/react";
import { StockBadge } from "../stock-badge";

const meta: Meta<typeof StockBadge> = {
  title: "Entities/StockBadge",
  component: StockBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StockBadge>;

export const InStock: Story = {
  args: {
    stock: 50,
    lowLabel: "Low stock",
    inStockLabel: "In stock",
  },
};

export const LowStock: Story = {
  args: {
    stock: 5,
    lowLabel: "Low stock",
    inStockLabel: "In stock",
  },
};
