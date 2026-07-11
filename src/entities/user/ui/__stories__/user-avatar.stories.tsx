import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../user-avatar";
import type { User } from "../../model/types";

const mockUser: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  age: 30,
  gender: "male",
  email: "john@example.com",
  phone: "+1234567890",
  username: "johndoe",
  image: "https://i.dummyjson.com/data/user/1/medium.jpg",
  company: { name: "Acme" },
  address: {
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    stateCode: "IL",
    postalCode: "62701",
    country: "US",
  },
};

const meta: Meta<typeof UserAvatar> = {
  title: "Entities/UserAvatar",
  component: UserAvatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {
  args: {
    user: mockUser,
  },
};
