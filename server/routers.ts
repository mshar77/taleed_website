import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getSiteSettings,
  listBanners,
  listCategories,
  listFaqs,
  listProducts,
  updateCategory,
  updateProduct,
} from "./db";
import { storagePut } from "./storage";

const categoryInput = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(140),
  icon: z.string().max(60).default("package"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const productInput = z.object({
  categoryId: z.number().int().nullable().optional(),
  name: z.string().min(1).max(220),
  code: z.string().max(120).nullable().optional(),
  brand: z.string().max(120).nullable().optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  imageKey: z.string().max(300).nullable().optional(),
  imageWidth: z.number().int().nullable().optional(),
  imageHeight: z.number().int().nullable().optional(),
  status: z.enum(["available", "limited", "check", "unavailable"]).default("check"),
  tag: z.string().max(80).nullable().optional(),
  sortOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const ensureAdmin = (user: { role: string } | null | undefined) => {
  if (!user || user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "هذه الصفحة للمدير فقط" });
  }
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    categories: publicProcedure.query(() => listCategories()),
    products: publicProcedure.query(() => listProducts()),
    banners: publicProcedure.query(() => listBanners()),
    faqs: publicProcedure.query(() => listFaqs()),
    settings: publicProcedure.query(() => getSiteSettings()),
  }),
  admin: router({
    overview: adminProcedure.query(async () => {
      const [categories, products, banners, faqs] = await Promise.all([
        listCategories(true),
        listProducts(true),
        listBanners(true),
        listFaqs(true),
      ]);
      return { categories, products, banners, faqs };
    }),
    categories: router({
      create: adminProcedure.input(categoryInput).mutation(({ input }) => createCategory(input)),
      update: adminProcedure.input(categoryInput.extend({ id: z.number().int() })).mutation(({ input }) => {
        const { id, ...values } = input;
        return updateCategory(id, values);
      }),
      remove: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteCategory(input.id)),
    }),
    products: router({
      create: adminProcedure.input(productInput).mutation(({ input }) => createProduct(input)),
      update: adminProcedure.input(productInput.extend({ id: z.number().int() })).mutation(({ input }) => {
        const { id, ...values } = input;
        return updateProduct(id, values);
      }),
      remove: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteProduct(input.id)),
    }),
    uploadImage: adminProcedure.input(z.object({
      filename: z.string().min(1).max(180),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      base64: z.string().min(1).max(12_000_000),
      width: z.number().int().positive().max(10000),
      height: z.number().int().positive().max(10000),
    })).mutation(async ({ input }) => {
      const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      const buffer = Buffer.from(input.base64, "base64");
      if (buffer.length > 8 * 1024 * 1024) {
        throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "حجم الصورة يجب ألا يتجاوز 8 ميجابايت" });
      }
      return storagePut(`products/${Date.now()}-${safeName}`, buffer, input.contentType).then(result => ({ ...result, width: input.width, height: input.height }));
    }),
  }),
});

export type AppRouter = typeof appRouter;
