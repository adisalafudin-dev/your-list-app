export type User = {
  id: number;
  email: string;
};

export type Category = {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export const ITEM_STATUSES = [
  "planning",
  "in_progress",
  "completed",
  "dropped",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];

export type Item = {
  id: number;
  title: string;
  categoryId: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: number;
  name: string;
  userId: number;
};
