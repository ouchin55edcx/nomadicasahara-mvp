"use server";

import {cookies} from "next/headers";
import {getLocale} from "next-intl/server";
import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing";

export type Category = {
  id: string;
  name: string;
  description: string;
  photo: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type ActionResult = {success: boolean; error?: string; category?: Category};
const apiBaseUrl = () => (process.env.API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export async function getPublicCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiBaseUrl()}/API/V1/categories`, {cache: "no-store"});
    const result = await response.json().catch(() => null);
    return response.ok && Array.isArray(result?.categories) ? result.categories : [];
  } catch {
    return [];
  }
}

async function apiRequest(path: string, method: string, body?: FormData) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(({name, value}) => `${name}=${value}`).join("; ");
  const headers = new Headers({
    Cookie: cookieHeader,
    Origin: process.env.FRONTEND_URL || "http://localhost:3000",
  });
  return fetch(`${apiBaseUrl()}${path}`, {
    method,
    headers,
    ...(body ? {body} : {}),
    cache: "no-store",
  });
}

async function requirePartner(response: Response) {
  if (response.status !== 401 && response.status !== 403) return;
  const locale = (await getLocale()) ?? routing.defaultLocale;
  redirect(`/${locale}/partner/login`);
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiRequest("/API/V1/categories", "GET");
  await requirePartner(response);
  const result = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(result?.categories)) {
    throw new Error(result?.message || "Unable to load categories.");
  }
  return result.categories;
}

async function saveCategory(path: string, method: "POST" | "PUT", formData: FormData): Promise<ActionResult> {
  const body = new FormData();
  body.set("name", String(formData.get("name") || ""));
  body.set("description", String(formData.get("description") || ""));
  body.set("removeImage", String(formData.get("removeImage") || "false"));
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) body.set("image", image);

  let response: Response;
  try {
    response = await apiRequest(path, method, body);
  } catch {
    return {success: false, error: "Unable to reach the category service."};
  }
  await requirePartner(response);
  const result = await response.json().catch(() => null);
  if (!response.ok) return {success: false, error: result?.message || "Unable to save category."};
  return {success: true, category: result?.category};
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  return saveCategory("/API/V1/categories", "POST", formData);
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  return saveCategory(`/API/V1/categories/${encodeURIComponent(id)}`, "PUT", formData);
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  let response: Response;
  try {
    response = await apiRequest(`/API/V1/categories/${encodeURIComponent(id)}`, "DELETE");
  } catch {
    return {success: false, error: "Unable to reach the category service."};
  }
  await requirePartner(response);
  const result = await response.json().catch(() => null);
  return response.ok ? {success: true} : {success: false, error: result?.message || "Unable to delete category."};
}
