import type { Meta, StoryObj } from "@storybook/react";
import { OrderStatusBadge } from "../order-status-badge";

const meta: Meta<typeof OrderStatusBadge> = {
  title: "Entities/OrderStatusBadge",
  component: OrderStatusBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OrderStatusBadge>;

export const Pending: Story = {
  args: {
    status: "pending",
    label: "Pending",
  },
};

export const Processing: Story = {
  args: {
    status: "processing",
    label: "Processing",
  },
};

export const Shipped: Story = {
  args: {
    status: "shipped",
    label: "Shipped",
  },
};

export const Delivered: Story = {
  args: {
    status: "delivered",
    label: "Delivered",
  },
};

export const Cancelled: Story = {
  args: {
    status: "cancelled",
    label: "Cancelled",
  },
};
