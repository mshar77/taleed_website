import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { ArrowRight, Check, LayoutDashboard, LogOut, Package, Pencil, Plus, Tags, Trash2, Upload } from "lucide-react";

const emptyProduct = { id: 0, name: "", code: "", brand: "", description: "", categoryId: "", imageUrl: "", imageKey: "", imageWidth: 0, imageHeight: 0, status: "check" as "check" | "available" | "limited" | "unavailable", tag: "", isFeatured: false };

type ProductForm = typeof emptyProduct;

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\u0600-\u06ff\w-]/g, "");
}

function readImage(file: File) {
  return new Promise<{ base64: string; width: number; height: number }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذر قراءة الصورة"));
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve({ base64: String(reader.result).split(",")[1] ?? "", width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error("الصورة غير صالحة"));
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [categoryForm, setCategoryForm] = useState({ id: 0, name: "", slug: "", icon: "package" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const utils = trpc.useUtils();
  const overview = trpc.admin.overview.useQuery(undefined, { retry: false, enabled: Boolean(user?.role === "admin") });
  const createProduct = trpc.admin.products.create.useMutation();
  const updateProduct = trpc.admin.products.update.useMutation();
  const removeProduct = trpc.admin.products.remove.useMutation();
  const createCategory = trpc.admin.categories.create.useMutation();
  const updateCategory = trpc.admin.categories.update.useMutation();
  const removeCategory = trpc.admin.categories.remove.useMutation();
  const uploadImage = trpc.admin.uploadImage.useMutation();

  const categories = overview.data?.categories ?? [];
  const products = overview.data?.products ?? [];
  const activeProduct = useMemo(() => productForm.id > 0, [productForm.id]);

  const refresh = async () => { await utils.admin.overview.invalidate(); await utils.catalog.products.invalidate(); await utils.catalog.categories.invalidate(); };
  const resetProduct = () => { setProductForm(emptyProduct); setImageFile(null); };
  const resetCategory = () => setCategoryForm({ id: 0, name: "", slug: "", icon: "package" });

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productForm.name.trim()) return toast.error("اكتب اسم المنتج أولًا");
    setSaving(true);
    try {
      let image = { imageUrl: productForm.imageUrl || null, imageKey: productForm.imageKey || null, imageWidth: productForm.imageWidth || null, imageHeight: productForm.imageHeight || null };
      if (imageFile) {
        if (imageFile.size > 8 * 1024 * 1024) throw new Error("حجم الصورة يجب ألا يتجاوز 8 ميجابايت");
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(imageFile.type)) throw new Error("الصيغ المسموحة JPG وPNG وWEBP فقط");
        const data = await readImage(imageFile);
        const uploaded = await uploadImage.mutateAsync({ filename: imageFile.name, contentType: imageFile.type as "image/jpeg" | "image/png" | "image/webp", ...data });
        image = { imageUrl: uploaded.url, imageKey: uploaded.key, imageWidth: uploaded.width, imageHeight: uploaded.height };
      }
      const input = {
        name: productForm.name.trim(), code: productForm.code || null, brand: productForm.brand || null, description: productForm.description || null,
        categoryId: productForm.categoryId ? Number(productForm.categoryId) : null, status: productForm.status, tag: productForm.tag || null, isFeatured: productForm.isFeatured,
        sortOrder: 0, isActive: true, ...image,
      };
      if (activeProduct) await updateProduct.mutateAsync({ id: productForm.id, ...input }); else await createProduct.mutateAsync(input);
      toast.success(activeProduct ? "تم تحديث المنتج" : "تمت إضافة المنتج");
      resetProduct(); await refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر حفظ المنتج"); } finally { setSaving(false); }
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) return toast.error("اكتب اسم القسم");
    try {
      const input = { name: categoryForm.name.trim(), slug: categoryForm.slug.trim() || slugify(categoryForm.name), icon: categoryForm.icon, sortOrder: 0, isActive: true };
      if (categoryForm.id) await updateCategory.mutateAsync({ id: categoryForm.id, ...input }); else await createCategory.mutateAsync(input);
      toast.success(categoryForm.id ? "تم تحديث القسم" : "تمت إضافة القسم"); resetCategory(); await refresh();
    } catch (error) { toast.error(error instanceof Error ? error.message : "تعذر حفظ القسم"); }
  };

  const confirmDeleteProduct = async (id: number) => { if (!window.confirm("سيتم إخفاء المنتج من الموقع. هل تريد المتابعة؟")) return; await removeProduct.mutateAsync({ id }); toast.success("تم حذف المنتج"); await refresh(); };
  const confirmDeleteCategory = async (id: number) => { if (!window.confirm("سيتم إخفاء القسم. المنتجات داخله لن تُحذف. هل تريد المتابعة؟")) return; await removeCategory.mutateAsync({ id }); toast.success("تم حذف القسم"); await refresh(); };

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f5f7f7]">جاري التحقق من الدخول...</div>;
  if (!user) return <div className="min-h-screen grid place-items-center bg-[#f5f7f7] p-6"><div className="bg-white rounded-2xl p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-[#172c3d]">لوحة تحكم تليد وجديد</h1><p className="mt-3 text-slate-500">سجّل الدخول بحساب المدير للوصول إلى اللوحة.</p><Button className="mt-6 bg-[#c99735]" onClick={() => window.location.href = "/"}>العودة للموقع</Button></div></div>;
  if (user.role !== "admin" || overview.error) return <div className="min-h-screen grid place-items-center bg-[#f5f7f7] p-6"><div className="bg-white rounded-2xl p-8 text-center shadow-sm"><h1 className="text-2xl font-bold text-[#172c3d]">لا تملك صلاحية الدخول</h1><p className="mt-3 text-slate-500">حساب المدير فقط يستطيع تعديل محتوى الموقع.</p><Button className="mt-6" variant="outline" onClick={() => setLocation("/")}>العودة للموقع</Button></div></div>;

  return <div dir="rtl" className="min-h-screen bg-[#f5f7f7] text-[#243b4a]">
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#172c3d] text-[#d6a642]"><LayoutDashboard size={20} /></div><div><p className="font-bold">لوحة تحكم تليد وجديد</p><p className="text-xs text-slate-500">إدارة الكتالوج والمحتوى</p></div></div><div className="flex items-center gap-2"><Link href="/"><Button variant="ghost" size="sm"><ArrowRight className="ml-1" size={16} /> الموقع</Button></Link><Button variant="ghost" size="sm" onClick={logout}><LogOut className="ml-1" size={16} /> خروج</Button></div></div></header>
    <main className="mx-auto max-w-7xl px-4 py-8"><div className="mb-7 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#172c3d] p-5 text-white"><p className="text-sm text-slate-300">المنتجات</p><p className="mt-2 text-3xl font-bold">{products.length}</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">الأقسام</p><p className="mt-2 text-3xl font-bold text-[#b2842d]">{categories.length}</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">الصور ترفع إلى تخزين سحابي</p><p className="mt-2 font-semibold text-emerald-700">آمن وقابل للتوسع</p></div></div>
      <div className="mb-5 flex flex-wrap gap-2"><Button variant={tab === "products" ? "default" : "outline"} className={tab === "products" ? "bg-[#172c3d]" : "bg-white"} onClick={() => setTab("products")}><Package className="ml-2" size={17} /> المنتجات</Button><Button variant={tab === "categories" ? "default" : "outline"} className={tab === "categories" ? "bg-[#172c3d]" : "bg-white"} onClick={() => setTab("categories")}><Tags className="ml-2" size={17} /> الأقسام</Button></div>
      {tab === "categories" ? <section className="grid gap-6 lg:grid-cols-[340px_1fr]"><form onSubmit={saveCategory} className="rounded-2xl bg-white p-5 shadow-sm h-fit"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold">{categoryForm.id ? "تعديل قسم" : "إضافة قسم"}</h2>{categoryForm.id && <Button type="button" size="sm" variant="ghost" onClick={resetCategory}>إلغاء</Button>}</div><Label>اسم القسم</Label><Input className="mt-2" value={categoryForm.name} onChange={e => setCategoryForm(v => ({ ...v, name: e.target.value, slug: v.id ? v.slug : slugify(e.target.value) }))} placeholder="مثال: المحرك" /><Label className="mt-4 block">المعرّف المختصر</Label><Input className="mt-2" value={categoryForm.slug} onChange={e => setCategoryForm(v => ({ ...v, slug: e.target.value }))} placeholder="engine" /><Button className="mt-5 w-full bg-[#c99735] text-[#172c3d] hover:bg-[#b9892d]"><Check className="ml-2" size={16} /> حفظ القسم</Button></form><div className="rounded-2xl bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">الأقسام الحالية</h2><div className="space-y-2">{categories.map(({ id, name, slug, isActive }) => <div key={id} className="flex items-center justify-between rounded-xl border p-3"><div><p className="font-semibold">{name}</p><p className="text-xs text-slate-400">{slug} · {isActive ? "ظاهر" : "مخفي"}</p></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setCategoryForm({ id, name, slug, icon: "package" })}><Pencil size={16} /></Button><Button size="icon" variant="ghost" className="text-red-600" onClick={() => confirmDeleteCategory(id)}><Trash2 size={16} /></Button></div></div>)}{categories.length === 0 && <p className="py-8 text-center text-slate-400">لا توجد أقسام بعد</p>}</div></div></section> : <section className="grid gap-6 xl:grid-cols-[380px_1fr]"><form onSubmit={saveProduct} className="rounded-2xl bg-white p-5 shadow-sm h-fit"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold">{activeProduct ? "تعديل منتج" : "إضافة منتج"}</h2>{activeProduct && <Button type="button" size="sm" variant="ghost" onClick={resetProduct}>إلغاء</Button>}</div><Label>اسم المنتج *</Label><Input className="mt-2" value={productForm.name} onChange={e => setProductForm(v => ({ ...v, name: e.target.value }))} placeholder="فلتر هواء للمحرك" /><div className="mt-4 grid grid-cols-2 gap-3"><div><Label>رقم القطعة</Label><Input className="mt-2" value={productForm.code} onChange={e => setProductForm(v => ({ ...v, code: e.target.value }))} /></div><div><Label>الماركة</Label><Input className="mt-2" value={productForm.brand} onChange={e => setProductForm(v => ({ ...v, brand: e.target.value }))} /></div></div><Label className="mt-4 block">القسم</Label><select className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm" value={productForm.categoryId} onChange={e => setProductForm(v => ({ ...v, categoryId: e.target.value }))}><option value="">بدون قسم</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><Label className="mt-4 block">الحالة</Label><select className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm" value={productForm.status} onChange={e => setProductForm(v => ({ ...v, status: e.target.value as ProductForm["status"] }))}><option value="available">متوفر</option><option value="limited">كمية محدودة</option><option value="check">تأكد من التوفر</option><option value="unavailable">غير متوفر</option></select><Label className="mt-4 block">الوصف</Label><Textarea className="mt-2" rows={3} value={productForm.description} onChange={e => setProductForm(v => ({ ...v, description: e.target.value }))} /><Label className="mt-4 block">صورة المنتج</Label><label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-sm text-slate-500 hover:bg-slate-50"><Upload size={18} />{imageFile ? imageFile.name : productForm.imageUrl ? "تغيير الصورة الحالية" : "اختر صورة JPG أو PNG أو WEBP"}<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} /></label>{productForm.imageUrl && !imageFile && <img src={productForm.imageUrl} alt="الصورة الحالية" className="mt-3 max-h-40 w-full rounded-lg object-contain bg-slate-100" />}<Button disabled={saving} className="mt-5 w-full bg-[#c99735] text-[#172c3d] hover:bg-[#b9892d]"><Plus className="ml-2" size={16} />{saving ? "جاري الحفظ..." : activeProduct ? "حفظ التعديل" : "إضافة المنتج"}</Button></form><div className="rounded-2xl bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">المنتجات الحالية</h2><p className="mt-1 text-xs text-slate-500">تقدر تعدل أو تحذف أي منتج بدون لمس الكود</p></div><Badge variant="secondary">{products.length} منتج</Badge></div><div className="space-y-3">{products.map(({ product, category }) => <div key={product.id} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" /> : <div className="grid h-full place-items-center text-slate-300"><Package size={25} /></div>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{product.name}</p><Badge variant="outline">{product.status === "available" ? "متوفر" : product.status === "unavailable" ? "غير متوفر" : "تأكد من التوفر"}</Badge></div><p className="mt-1 text-xs text-slate-500">{product.code || "بدون رقم"} · {product.brand || "بدون ماركة"} · {category?.name || "بدون قسم"}</p></div><div className="flex gap-1"><Button size="icon" variant="ghost" onClick={() => setProductForm({ id: product.id, name: product.name, code: product.code || "", brand: product.brand || "", description: product.description || "", categoryId: product.categoryId ? String(product.categoryId) : "", imageUrl: product.imageUrl || "", imageKey: product.imageKey || "", imageWidth: product.imageWidth || 0, imageHeight: product.imageHeight || 0, status: product.status, tag: product.tag || "", isFeatured: product.isFeatured })}><Pencil size={16} /></Button><Button size="icon" variant="ghost" className="text-red-600" onClick={() => confirmDeleteProduct(product.id)}><Trash2 size={16} /></Button></div></div>)}{products.length === 0 && <div className="py-16 text-center text-slate-400">لا توجد منتجات بعد. أضف أول منتج من النموذج.</div>}</div></div></section>}
    </main>
  </div>;
}
