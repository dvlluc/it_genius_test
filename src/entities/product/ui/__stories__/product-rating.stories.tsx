import type { Meta, StoryObj } from "@storybook/react";
import { ProductRating } from "../product-rating";

const meta: Meta<typeof ProductRating> = {
  title: "Entities/ProductRating",
  component: ProductRating,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductRating>;

export const HighRating: Story = {
  args: {
    value: 4.8,
  },
};

export const MediumRating: Story = {
  args: {
    value: 3.5,
  },
};

export const LowRating: Story = {
  args: {
    value: 2.1,
  },
};
