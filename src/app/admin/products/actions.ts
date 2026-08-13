"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";

// Helper to verify if the user is an admin
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign-in.");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const isEmailAdmin = user.email && adminEmails.includes(user.email.toLowerCase());

  if (!isEmailAdmin) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!adminUser) {
      throw new Error("Unauthorized: Access denied.");
    }
  }

  return user;
}

// Action to create a new product
export async function createProductAction(data: {
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  has_nfc: boolean;
  rakhi_type: "none" | "name" | "photo";
  images: string[];
  display_order: number;
  variants?: Array<{
    type: "head_design" | "thread_color" | "size";
    name: string;
    price_delta: number;
  }>;
}) {
  await verifyAdmin();
  const supabase = createServiceClient();

  // 1. Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name:          data.name,
      slug:          data.slug,
      description:   data.description,
      base_price:    Math.round(data.base_price * 100), // ₹ → paise
      has_nfc:       data.has_nfc,
      rakhi_type:    data.rakhi_type,
      images:        data.images,
      display_order: data.display_order,
      is_active:     true,
    })
    .select()
    .single();

  if (productError) {
    throw new Error(`Failed to create product: ${productError.message}`);
  }

  // 2. Insert variants if any
  if (data.variants?.length) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(
        data.variants.map((v, i) => ({
          product_id:    product.id,
          type:          v.type,
          name:          v.name,
          price_delta:   Math.round(v.price_delta * 100), // ₹ → paise
          display_order: i,
        }))
      );

    if (variantError) {
      throw new Error(`Failed to create product variants: ${variantError.message}`);
    }
  }

  return product;
}

// Action to update an existing product
export async function updateProductAction(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    base_price: number;
    has_nfc: boolean;
    rakhi_type: "none" | "name" | "photo";
    images: string[];
    display_order: number;
    variants?: Array<{
      type: "head_design" | "thread_color" | "size";
      name: string;
      price_delta: number;
    }>;
  }
) {
  await verifyAdmin();
  const supabase = createServiceClient();

  // 1. Update product base info
  const { error: productError } = await supabase
    .from("products")
    .update({
      name:          data.name,
      slug:          data.slug,
      description:   data.description,
      base_price:    Math.round(data.base_price * 100), // ₹ → paise
      has_nfc:       data.has_nfc,
      rakhi_type:    data.rakhi_type,
      images:        data.images,
      display_order: data.display_order,
    })
    .eq("id", id);

  if (productError) {
    throw new Error(`Failed to update product: ${productError.message}`);
  }

  // 2. Sync variants (clear and re-insert)
  const { error: deleteError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id);

  if (deleteError) {
    throw new Error(`Failed to clear existing variants: ${deleteError.message}`);
  }

  if (data.variants?.length) {
    const { error: insertError } = await supabase
      .from("product_variants")
      .insert(
        data.variants.map((v, i) => ({
          product_id:    id,
          type:          v.type,
          name:          v.name,
          price_delta:   Math.round(v.price_delta * 100), // ₹ → paise
          display_order: i,
        }))
      );

    if (insertError) {
      throw new Error(`Failed to insert product variants: ${insertError.message}`);
    }
  }

  return { success: true };
}

// Action to toggle active state of a product
export async function toggleProductActiveAction(id: string, currentStatus: boolean) {
  await verifyAdmin();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("products")
    .update({ is_active: !currentStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to toggle product status: ${error.message}`);
  }

  return { success: true };
}

// Action to delete a product
export async function deleteProductAction(id: string) {
  await verifyAdmin();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return { success: true };
}
