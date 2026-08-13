"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateProductAction } from "../actions";

const schema = z.object({
  name:          z.string().min(2),
  slug:          z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  description:   z.string().optional(),
  base_price:    z.coerce.number().min(1, "Price required (in ₹)"),
  has_nfc:       z.boolean(),
  rakhi_type:    z.enum(["none", "name", "photo"]).default("none"),
  display_order: z.coerce.number().default(0),
  variants: z.array(z.object({
    type:        z.enum(["head_design", "thread_color", "size"]),
    name:        z.string().min(1),
    price_delta: z.coerce.number().default(0),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { has_nfc: false, rakhi_type: "none", display_order: 0, variants: [] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove } = useFieldArray({ control: control as any, name: "variants" });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error: productError } = await supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("id", id)
        .single();

      if (productError) throw productError;

      if (data) {
        setUploadedImages(data.images || []);
        reset({
          name: data.name,
          slug: data.slug,
          description: data.description || "",
          base_price: data.base_price / 100, // paise → ₹
          has_nfc: data.has_nfc,
          rakhi_type: data.rakhi_type || "none",
          display_order: data.display_order,
          variants: (data.product_variants || []).map((v: any) => ({
            type: v.type,
            name: v.name,
            price_delta: v.price_delta / 100, // paise → ₹
          })),
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of files) {
      const path = `products/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file);
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
        setUploadedImages((prev) => [...prev, publicUrl]);
      }
    }
    setUploading(false);
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError(null);

    try {
      await updateProductAction(id, {
        name:          data.name,
        slug:          data.slug,
        description:   data.description,
        base_price:    data.base_price,
        has_nfc:       data.has_nfc,
        rakhi_type:    data.rakhi_type,
        images:        uploadedImages,
        display_order: data.display_order,
        variants:      data.variants,
      });

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#94492c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#7A6860] hover:text-[#1B1C1C] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#1B1C1C]">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 flex flex-col gap-4">
          <h2 className="font-bold text-[15px] text-[#1B1C1C]">Basic Information</h2>

          <div>
            <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Product Name *</label>
            <input {...register("name")} placeholder="NFC Memory Rakhi" className="input" />
            {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">
              Slug * <span className="font-normal text-[#7A6860]">(URL: /shop/{watch("slug") || "..."})</span>
            </label>
            <input {...register("slug")} placeholder="nfc-memory-rakhi" className="input" />
            {errors.slug && <p className="text-red-500 text-[11px] mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Description</label>
            <textarea {...register("description")} rows={3} placeholder="Product description…" className="input resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Base Price (₹) *</label>
              <input {...register("base_price")} type="number" step="0.01" placeholder="2499" className="input" />
              {errors.base_price && <p className="text-red-500 text-[11px] mt-1">{errors.base_price.message}</p>}
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#1B1C1C] mb-1.5 block">Display Order</label>
              <input {...register("display_order")} type="number" placeholder="1" className="input" />
            </div>
          </div>

          {/* NFC toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register("has_nfc")} type="checkbox" className="w-5 h-5 accent-[#94492c] rounded" />
            <div>
              <p className="font-semibold text-[14px] text-[#1B1C1C]">Has NFC Tag</p>
              <p className="text-[12px] text-[#7A6860]">Customers will be asked to submit a memory link after purchase</p>
            </div>
          </label>

          {/* Rakhi Type */}
          <div>
            <p className="text-[13px] font-semibold text-[#1B1C1C] mb-2">Rakhi Type</p>
            <p className="text-[12px] text-[#7A6860] mb-3">What extra information should customers provide after purchase?</p>
            <div className="flex flex-col gap-2">
              {([
                { value: "none",  label: "None",         hint: "No extra info required" },
                { value: "name",  label: "Name-based",   hint: "Customer enters 1 name per rakhi (great for engraving)" },
                { value: "photo", label: "Photo-based",  hint: "Customer uploads 1 photo per rakhi" },
              ] as const).map(({ value, label, hint }) => (
                <label key={value} className="flex items-start gap-3 p-3 rounded-xl border border-[#e8ddd7] cursor-pointer hover:border-[#94492c]/40 transition-colors has-[:checked]:border-[#94492c] has-[:checked]:bg-[#94492c]/5">
                  <input
                    type="radio"
                    value={value}
                    {...register("rakhi_type")}
                    className="mt-0.5 accent-[#94492c]"
                  />
                  <div>
                    <p className="font-semibold text-[13px] text-[#1B1C1C]">{label}</p>
                    <p className="text-[11px] text-[#7A6860]">{hint}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 flex flex-col gap-4">
          <h2 className="font-bold text-[15px] text-[#1B1C1C]">Product Images</h2>
          <label className="flex items-center justify-center gap-3 border-2 border-dashed border-[#e8ddd7] rounded-xl p-8 cursor-pointer hover:border-[#94492c]/40 transition-colors">
            <Upload className="w-5 h-5 text-[#7A6860]" />
            <span className="text-[13px] text-[#7A6860]">
              {uploading ? "Uploading…" : "Click to upload images (JPEG, PNG, WebP)"}
            </span>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e8ddd7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setUploadedImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-2xl border border-[#e8ddd7] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[15px] text-[#1B1C1C]">Variants</h2>
            <button
              type="button"
              onClick={() => append({ type: "head_design", name: "", price_delta: 0 })}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#94492c] border border-[#94492c]/30 px-3 py-1.5 rounded-lg hover:bg-[#94492c]/5 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Variant
            </button>
          </div>

          {fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-3 gap-3 items-end p-3 bg-[#FBF7F4] rounded-xl">
              <div>
                <label className="text-[11px] font-semibold text-[#7A6860] mb-1 block">Type</label>
                <select {...register(`variants.${i}.type`)} className="input text-[13px]">
                  <option value="head_design">Head Design</option>
                  <option value="thread_color">Thread Color</option>
                  <option value="size">Size</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#7A6860] mb-1 block">Name</label>
                <input {...register(`variants.${i}.name`)} placeholder="Lotus" className="input text-[13px]" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-[#7A6860] mb-1 block">+Price (₹)</label>
                  <input {...register(`variants.${i}.price_delta`)} type="number" placeholder="0" className="input text-[13px]" />
                </div>
                <button type="button" onClick={() => remove(i)} className="mb-0 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <p className="text-[13px] text-[#7A6860] text-center py-4">No variants yet. Add head designs, thread colors, etc.</p>
          )}
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-[13px] text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#94492c] hover:bg-[#7a3b22] disabled:opacity-60 text-white font-bold py-4 rounded-full text-[15px] transition-all flex items-center justify-center"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save Changes"}
        </button>
      </form>

      <style>{`.input { width: 100%; border: 1px solid #e8ddd7; border-radius: 0.75rem; padding: 0.6rem 1rem; font-size: 0.875rem; background: #FBF7F4; outline: none; } .input:focus { border-color: #94492c; box-shadow: 0 0 0 2px rgba(148,73,44,0.1); }`}</style>
    </div>
  );
}
