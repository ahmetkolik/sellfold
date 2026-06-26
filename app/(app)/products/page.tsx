"use client";

import { useEffect, useState } from "react";
import {
  Plus, Wallet, BookOpen, LayoutTemplate, SlidersHorizontal, GraduationCap, Pencil, Loader2, X, ImagePlus, ArrowUpRight, FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLang } from "@/components/i18n/language-provider";
import type { ProductType } from "@/lib/demo/data";
import { fetchProducts, type FullProduct } from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, formatNumber, cn } from "@/lib/utils";

const typeIcon: Record<ProductType, typeof BookOpen> = {
  ebook: BookOpen, template: LayoutTemplate, preset: SlidersHorizontal, course: GraduationCap,
};
const typeLabel: Record<ProductType, { tr: string; en: string }> = {
  ebook: { tr: "E-kitap", en: "Ebook" },
  template: { tr: "Şablon", en: "Template" },
  preset: { tr: "Preset", en: "Preset" },
  course: { tr: "Kurs", en: "Course" },
};

function Cover({ hue, emoji, className = "" }: { hue: string; emoji: string; className?: string }) {
  return (
    <div
      className={`grid place-items-center ${className}`}
      style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${hue}) 0%, oklch(86% 0.13 ${hue}) 100%)` }}
    >
      <span className="text-3xl drop-shadow-sm">{emoji}</span>
    </div>
  );
}

const PRODUCT_TYPES: ProductType[] = ["ebook", "template", "preset", "course"];
const HUE_OPTIONS = [
  { label: "Mavi", value: "220" },
  { label: "Mor", value: "280" },
  { label: "Yeşil", value: "150" },
  { label: "Turuncu", value: "30" },
  { label: "Pembe", value: "340" },
  { label: "Kırmızı", value: "10" },
];

interface EditableProduct {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  emoji: string;
  hue: string;
  live: boolean;
  category: string | null;
  category_image_url?: string | null;
  file_url?: string | null;
  file_url_en?: string | null;
  gallery_images?: string[];
  description?: string | null;
  description_en?: string | null;
}

const FILE_ACCEPT = ".pdf,.zip,.epub,.docx,.xlsx,.pptx,.mp4,.mp3,.png,.jpg,.jpeg,.gif,.svg,.ai,.psd,.figma";

function ProductModal({
  onClose,
  onSaved,
  editProduct,
}: {
  onClose: () => void;
  onSaved: () => void;
  editProduct?: EditableProduct;
}) {
  const { lang } = useLang();
  const isEdit = !!editProduct;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(editProduct?.category_image_url ?? null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>(editProduct?.gallery_images?.slice(0, 4) ?? [null, null, null, null]);
  const [digitalFileTr, setDigitalFileTr] = useState<File | null>(null);
  const [digitalFileEn, setDigitalFileEn] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: editProduct?.title ?? "",
    type: (editProduct?.type ?? "ebook") as ProductType,
    price: editProduct ? String(editProduct.price) : "",
    emoji: editProduct?.emoji ?? "📦",
    hue: editProduct?.hue ?? "220",
    live: editProduct?.live ?? false,
    category: editProduct?.category ?? "",
    description: editProduct?.description ?? "",
    description_en: editProduct?.description_en ?? "",
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function handleCategoryImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCategoryImageFile(file);
    setCategoryImagePreview(URL.createObjectURL(file));
  }

  async function uploadFile(file: File, path: string): Promise<string> {
    const supabase = createClient();
    await supabase.storage.from("product-files").upload(path, file, { upsert: true });
    return supabase.storage.from("product-files").getPublicUrl(path).data.publicUrl;
  }

  async function handleSave() {
    if (!form.title.trim()) { setError(lang === "tr" ? "Başlık zorunlu" : "Title is required"); return; }
    const priceVal = parseInt(form.price, 10);
    if (!form.price || isNaN(priceVal) || priceVal < 0) { setError(lang === "tr" ? "Geçerli bir fiyat gir" : "Enter a valid price"); return; }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Session not found"); setLoading(false); return; }

    let categoryImageUrl: string | null = editProduct?.category_image_url ?? null;
    if (categoryImageFile) {
      const ext = categoryImageFile.name.split(".").pop();
      categoryImageUrl = await uploadFile(categoryImageFile, `category-images/${user.id}/${Date.now()}.${ext}`);
    }

    let fileUrl: string | null = editProduct?.file_url ?? null;
    if (digitalFileTr) {
      const ext = digitalFileTr.name.split(".").pop();
      fileUrl = await uploadFile(digitalFileTr, `files/${user.id}/${Date.now()}_tr.${ext}`);
    }

    let fileUrlEn: string | null = editProduct?.file_url_en ?? null;
    if (digitalFileEn) {
      const ext = digitalFileEn.name.split(".").pop();
      fileUrlEn = await uploadFile(digitalFileEn, `files/${user.id}/${Date.now()}_en.${ext}`);
    }

    const newGalleryUrls: string[] = [];
    for (let i = 0; i < 4; i++) {
      const existing = editProduct?.gallery_images?.[i];
      if (galleryFiles[i]) {
        const ext = galleryFiles[i]!.name.split(".").pop();
        const url = await uploadFile(galleryFiles[i]!, `gallery/${user.id}/${Date.now()}_${i}.${ext}`);
        newGalleryUrls.push(url);
      } else if (existing) {
        newGalleryUrls.push(existing);
      }
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      price: priceVal,
      emoji: form.emoji,
      hue: form.hue,
      live: form.live,
      category: form.category.trim() || null,
      category_image_url: categoryImageUrl,
      file_url: fileUrl,
      file_url_en: fileUrlEn,
      gallery_images: newGalleryUrls,
      description: form.description.trim() || null,
      description_en: form.description_en.trim() || null,
    };

    let dbError;
    if (isEdit) {
      ({ error: dbError } = await supabase.from("products").update(payload).eq("id", editProduct.id));
    } else {
      ({ error: dbError } = await supabase.from("products").insert({ ...payload, user_id: user.id }));
    }

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-semibold">
            {isEdit ? (lang === "tr" ? "Ürünü Düzenle" : "Edit Product") : (lang === "tr" ? "Yeni Ürün" : "New Product")}
          </h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {/* Preview */}
          {categoryImagePreview
            ? <img src={categoryImagePreview} alt="" className="h-28 w-full rounded-xl object-cover" />
            : <Cover hue={form.hue} emoji={form.emoji} className="h-28 w-full rounded-xl" />
          }

          <div className="space-y-1.5">
            <Label>{lang === "tr" ? "Başlık" : "Title"}</Label>
            <Input
              placeholder={lang === "tr" ? "Ürün adı..." : "Product name..."}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Tür" : "Type"}</Label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>{lang === "tr" ? typeLabel[t].tr : typeLabel[t].en}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Fiyat ($)" : "Price ($)"}</Label>
              <Input
                type="number"
                min="0"
                placeholder="99"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Emoji" : "Emoji"}</Label>
              <Input
                placeholder="📦"
                value={form.emoji}
                onChange={(e) => set("emoji", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Renk" : "Color"}</Label>
              <div className="flex gap-2 pt-1">
                {HUE_OPTIONS.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => set("hue", h.value)}
                    title={h.label}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                      form.hue === h.value ? "border-foreground scale-110" : "border-transparent",
                    )}
                    style={{ backgroundImage: `linear-gradient(140deg, oklch(94% 0.06 ${h.value}) 0%, oklch(70% 0.18 ${h.value}) 100%)` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Kategori" : "Category"}</Label>
              <Input
                placeholder={lang === "tr" ? "ör. Tasarım, Pazarlama…" : "e.g. Design, Marketing…"}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{lang === "tr" ? "Kapak Görseli" : "Cover Image"}</Label>
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
                <input type="file" accept="image/*" className="hidden" onChange={handleCategoryImage} />
                {categoryImagePreview
                  ? <img src={categoryImagePreview} alt="" className="h-6 w-6 rounded object-cover" />
                  : <ImagePlus className="h-4 w-4" />}
                <span className="truncate">
                  {categoryImageFile ? categoryImageFile.name : (lang === "tr" ? "Görsel seç" : "Select image")}
                </span>
              </label>
            </div>
          </div>

          {/* Gallery images (4 slots = total 5 with cover) */}
          <div className="space-y-2">
            <Label>{lang === "tr" ? "Ürün Galeri Görselleri (maks. 4 ek görsel)" : "Product Gallery Images (max 4 extra)"}</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <label key={i} className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-dashed border-border hover:border-primary transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const newFiles = [...galleryFiles]; newFiles[i] = file; setGalleryFiles(newFiles);
                      const newPreviews = [...galleryPreviews]; newPreviews[i] = URL.createObjectURL(file); setGalleryPreviews(newPreviews);
                    }}
                  />
                  {galleryPreviews[i]
                    ? <img src={galleryPreviews[i]!} alt="" className="h-full w-full object-cover" />
                    : <span className="flex h-full w-full items-center justify-center text-muted-foreground"><ImagePlus className="h-5 w-5" /></span>
                  }
                  <span className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 text-center text-[9px] text-white">{i + 2}</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">{lang === "tr" ? "Kapak görseli 1. sıra. Buraya 2–5. görselleri ekle." : "Cover image is #1. Add images 2–5 here."}</p>
          </div>

          {/* Descriptions (SEO) */}
          <div className="space-y-1.5">
            <Label>{lang === "tr" ? "🇹🇷 Türkçe Açıklama (SEO)" : "🇹🇷 Turkish Description (SEO)"}</Label>
            <textarea
              placeholder={lang === "tr" ? "Ürünün ne işe yaradığını, kim için olduğunu ve ne kazandırdığını detaylıca anlat…" : "Describe what the product does, who it's for, and what benefits it provides…"}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{lang === "tr" ? "🇬🇧 İngilizce Açıklama (SEO)" : "🇬🇧 English Description (SEO)"}</Label>
            <textarea
              placeholder="Describe what the product does, who it's for, and what benefits it provides…"
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>{lang === "tr" ? "🇹🇷 Türkçe Dosya (PDF, ZIP…)" : "🇹🇷 Turkish File (PDF, ZIP…)"}</Label>
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
              <input type="file" accept={FILE_ACCEPT} className="hidden" onChange={(e) => setDigitalFileTr(e.target.files?.[0] ?? null)} />
              <FileUp className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {digitalFileTr ? digitalFileTr.name : (editProduct?.file_url ? (lang === "tr" ? "Dosya mevcut — değiştir" : "File exists — replace") : (lang === "tr" ? "Dosya seç" : "Choose file"))}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <Label>{lang === "tr" ? "🇬🇧 İngilizce Dosya (PDF, ZIP…)" : "🇬🇧 English File (PDF, ZIP…)"}</Label>
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
              <input type="file" accept={FILE_ACCEPT} className="hidden" onChange={(e) => setDigitalFileEn(e.target.files?.[0] ?? null)} />
              <FileUp className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {digitalFileEn ? digitalFileEn.name : (editProduct?.file_url_en ? (lang === "tr" ? "Dosya mevcut — değiştir" : "File exists — replace") : (lang === "tr" ? "Dosya seç" : "Choose file"))}
              </span>
            </label>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => set("live", !form.live)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                form.live ? "bg-primary" : "bg-muted",
              )}
            >
              <span className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                form.live ? "translate-x-5" : "translate-x-0.5",
              )} />
            </div>
            <span className="text-sm font-medium">
              {form.live
                ? (lang === "tr" ? "Yayında — müşteriler görebilir" : "Live — customers can see it")
                : (lang === "tr" ? "Taslak — sadece sen görebilirsin" : "Draft — only you can see it")}
            </span>
          </label>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" onClick={onClose}>{lang === "tr" ? "İptal" : "Cancel"}</Button>
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? (lang === "tr" ? "Güncelle" : "Update") : (lang === "tr" ? "Kaydet" : "Save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

const STARTER_LIMIT = Infinity;

export default function ProductsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<ProductType | "all">("all");
  const [products, setProducts] = useState<FullProduct[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<EditableProduct | undefined>(undefined);
  const [userPlan, setUserPlan] = useState<string>("starter");

  function load() {
    fetchProducts().then(setProducts);
  }

  useEffect(() => {
    load();
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single()
        .then(({ data }) => { if (data?.plan) setUserPlan(data.plan); });
    });
  }, []);

  const m = {
    tr: {
      title: "Ürünler", sub: "Dükkânındaki dijital ürünler ve performansları.",
      add: "Yeni ürün", all: "Tümü", live: "Yayında", draft: "Taslak", sales: "satış", edit: "Düzenle",
      empty: "Henüz ürün yok", emptySub: "İlk dijital ürününü eklemek için butona tıkla.",
    },
    en: {
      title: "Products", sub: "The digital products in your store and how they perform.",
      add: "New product", all: "All", live: "Live", draft: "Draft", sales: "sales", edit: "Edit",
      empty: "No products yet", emptySub: "Click the button above to add your first digital product.",
    },
  }[lang];

  const filters: (ProductType | "all")[] = ["all", "ebook", "template", "preset", "course"];
  const list = products ?? [];
  const shown = filter === "all" ? list : list.filter((p) => p.type === filter);
  const atStarterLimit = userPlan === "starter" && list.length >= STARTER_LIMIT;

  return (
    <>
      {showModal && (
        <ProductModal
          onClose={() => { setShowModal(false); setEditProduct(undefined); }}
          onSaved={() => { setShowModal(false); setEditProduct(undefined); load(); }}
          editProduct={editProduct}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
            <p className="text-sm text-muted-foreground">{m.sub}</p>
          </div>
          <Button className="gap-2" onClick={() => !atStarterLimit && setShowModal(true)} disabled={atStarterLimit}>
            <Plus className="h-4 w-4" /> {m.add}
          </Button>
        </div>

        {atStarterLimit && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
            <p className="text-amber-800 dark:text-amber-200">
              {lang === "tr"
                ? "Starter plan 3 ürünle sınırlıdır. Sınırsız ürün için Creator planına geç."
                : "Starter plan is limited to 3 products. Upgrade to Creator for unlimited products."}
            </p>
            <a
              href="/settings"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
            >
              {lang === "tr" ? "Yükselt" : "Upgrade"} <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {f !== "all" && (() => { const I = typeIcon[f]; return <I className="h-3 w-3" />; })()}
              {f === "all" ? m.all : t(typeLabel[f])}
            </button>
          ))}
        </div>

        {products === null ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <span className="text-4xl">📦</span>
            <p className="mt-4 font-display text-lg font-semibold">{m.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{m.emptySub}</p>
            <Button className="mt-5 gap-2" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" /> {m.add}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const Icon = typeIcon[p.type];
              return (
                <div key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <div className="relative">
                    {p.category_image_url
                      ? <img src={p.category_image_url} alt={p.title} className="aspect-[16/9] w-full object-cover" />
                      : <Cover hue={p.hue} emoji={p.emoji} className="aspect-[16/9] w-full" />
                    }
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                      <Icon className="h-3 w-3" /> {t(typeLabel[p.type])}
                    </span>
                    <span className={cn(
                      "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      p.live ? "bg-success/90 text-success-foreground" : "bg-black/45 text-white",
                    )}>
                      {p.live ? m.live : m.draft}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="truncate font-medium">{p.title}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <p className="font-display text-lg font-semibold tabular-nums text-primary">{formatMoney(p.price)}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground tabular-nums">{formatNumber(p.sales)}</span> {m.sales}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />{formatMoney(p.revenue)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => { setEditProduct(p as EditableProduct); setShowModal(true); }}
                      >
                        <Pencil className="h-3 w-3" /> {m.edit}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
