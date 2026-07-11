import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "../stat-card";
import { UsersIcon } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Shared/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    title: "Total Users",
    value: "1,234",
    icon: UsersIcon,
  },
};

export const WithLargeNumber: Story = {
  args: {
    title: "Revenue",
    value: "$123,456",
    icon: UsersIcon,
  },
};
