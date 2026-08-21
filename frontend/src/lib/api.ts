import { apiClient } from "./axios";
import type { Category, Item, ItemStatus, Tag, User } from "../types";

export const api = {
  auth: {
    me: () =>
      apiClient.get<User>("/auth/me").then((res) => res.data),
    signIn: (email: string, password: string) =>
      apiClient
        .post<User>("/auth/sign-in", { email, password })
        .then((res) => res.data),
    register: (email: string, password: string) =>
      apiClient
        .post<User>("/auth/register", { email, password })
        .then((res) => res.data),
    signOut: () =>
      apiClient
        .post<{ message: string }>("/auth/sign-out")
        .then((res) => res.data),
  },

  categories: {
    getAll: () =>
      apiClient.get<Category[]>("/categories").then((res) => res.data),
    getById: (id: number) =>
      apiClient.get<Category>(`/categories/${id}`).then((res) => res.data),
    create: (name: string) =>
      apiClient
        .post<Category>("/categories", { name })
        .then((res) => res.data),
    update: (id: number, name: string) =>
      apiClient
        .patch<Category>(`/categories/${id}`, { name })
        .then((res) => res.data),
    delete: (id: number) =>
      apiClient.delete<Category>(`/categories/${id}`).then((res) => res.data),
    getItems: (
      categoryId: number,
      filters?: { search?: string; status?: ItemStatus },
    ) =>
      apiClient
        .get<Item[]>(`/categories/${categoryId}/items`, { params: filters })
        .then((res) => res.data),
  },

  items: {
    getById: (id: number) =>
      apiClient.get<Item>(`/items/${id}`).then((res) => res.data),
    create: (data: {
      title: string;
      categoryId: number;
      status?: ItemStatus;
    }) =>
      apiClient.post<Item>("/items", data).then((res) => res.data),
    update: (id: number, data: { title?: string; status?: ItemStatus }) =>
      apiClient.patch<Item>(`/items/${id}`, data).then((res) => res.data),
    delete: (id: number) =>
      apiClient.delete<Item>(`/items/${id}`).then((res) => res.data),
    getTags: (itemId: number) =>
      apiClient.get<Tag[]>(`/items/${itemId}/tags`).then((res) => res.data),
    attachTag: (itemId: number, tagId: number) =>
      apiClient
        .post<Tag[]>(`/items/${itemId}/tags/${tagId}`)
        .then((res) => res.data),
    detachTag: (itemId: number, tagId: number) =>
      apiClient
        .delete<Tag[]>(`/items/${itemId}/tags/${tagId}`)
        .then((res) => res.data),
  },

  tags: {
    getAll: () =>
      apiClient.get<Tag[]>("/tags").then((res) => res.data),
    create: (name: string) =>
      apiClient.post<Tag>("/tags", { name }).then((res) => res.data),
    delete: (id: number) =>
      apiClient.delete<Tag>(`/tags/${id}`).then((res) => res.data),
  },
};
