import { Disc3, Gauge, Package, Wrench, Filter, Thermometer, Truck, type LucideIcon } from "lucide-react";

export type CatalogCategory = {
  label: string;
  count?: string;
  icon: LucideIcon;
};

// يجب أن يطابق اسم القسم قيمة category في بيانات المنتج.
// تُحسب أعداد المنتجات تلقائيًا في الواجهة بدل وضع أرقام تقديرية هنا.
export const catalogCategories: CatalogCategory[] = [
  { label: "كل القطع", icon: Package },
  { label: "المحرك", icon: Gauge },
  { label: "الفلاتر", icon: Filter },
  { label: "التبريد", icon: Thermometer },
  { label: "الفرامل والهواء", icon: Disc3 },
  { label: "العفشة ونقل الحركة", icon: Truck },
  { label: "الكهرباء والملحقات", icon: Wrench },
];
