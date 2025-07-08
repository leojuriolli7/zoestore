# Zoe Store

Brazilian storefront with product management dashboard. No cart/checkout - just product display with admin CRUD operations.

## TODOs

- [ ] Sort by creation/edit date
- [ ] Add images to tags
- [ ] Render tags in homepage
- [ ] Rich-text for product description
- [ ] Multiple images per product, carousel on details page
- [ ] Add analytics

---

## Project Structure

**Domain-based organization:** Each business domain (Products, Auth) has its own folder under `src/query/`.

**Service structure:** Each endpoint within a domain contains:

- `schema.ts` - Zod schema + TypeScript type
- `handler.ts` - Business logic using schema/type
- `query.ts` or `mutation.ts` - React Query integration

**Types:** All return types declared in domain's `types.d.ts` namespace. Never inline types.

**Naming:** Service folders/files use `camelCase`, types are namespaced under domain.

```
src/query/products/
  config.ts
  types.d.ts
  listProducts/
    schema.ts
    handler.ts
    query.ts
```

---

## Adding New Services Checklist

1. Add query/mutation key in domain's `config.ts`
2. Create Zod schema + type in `schema.ts`
3. Declare return type in domain's `types.d.ts` namespace
4. Implement handler in `handler.ts` using schema and return type
5. Create `query.ts` or `mutation.ts` for React Query
6. Write route handler using `createRouteHandler` helper

**Never** redefine schemas or types inline. Always import from domain files.

---

## Route Handlers

Use `createRouteHandler` helper instead of manual try/catch:

```ts
import { createRouteHandler } from "@/query/core/createRouteHandler";
import { checkAdminKey } from "@/lib/checkAdminKey";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { BadRequestError } from "@/query/errors/BadRequestError";

// With params
const postHandler = async (req: NextRequest, params: { slug: string }) => {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new BadRequestError("Invalid request");

  return await handler(params.slug, parsed.data);
};

export const POST = createRouteHandler(postHandler);
```

```ts
// Without params
async function getHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const param = searchParams.get("param");

  const parsed = schema.safeParse({ param });
  if (!parsed.success) throw new BadRequestError("Invalid params");

  return await handler(parsed.data);
}

export const GET = createRouteHandler(getHandler);
```

---

## Admin Authentication

Admin-only endpoints must check authorization first:

```ts
const { isAdmin } = await checkAdminKey();
if (!isAdmin) throw new UnauthorizedError();
```

Authentication uses admin password cookie. Pages check with:

```ts
import { checkAdminKey } from "@/lib/checkAdminKey";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) redirect("/dashboard/login");

  return <DashboardContent />;
}
```

---

## React Query Usage

**Mutations:** Always use `mutateAsync`, never `onSuccess`/`onError`/`useEffect`:

```ts
const { mutateAsync: addProduct, isPending } = useMutation(addProductOptions());

const onSubmit = async (data: AddProductSchema) => {
  try {
    const result = await addProduct(data);
    // Handle success
  } catch (error) {
    toastError(error); // Always use toastError for consistent UX
  }
};
```

---

## Server-Side Rendering

Call handlers directly in RSC, avoid route handlers for server-rendered pages:

```ts
// Page component
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug); // Direct handler call

  return <ProductPageClient product={product} />;
}
```

```ts
// Client component
"use client";
export default function ProductPageClient({
  product: initialProduct,
}: {
  product: Product | null;
}) {
  const { data: product } = useQuery({
    ...getProductBySlugOptions(slug),
    enabled: !initialProduct,
    ...(initialProduct && { initialData: initialProduct }),
  });

  // Component logic...
}
```

---

## Error Handling

All errors extend `BaseError`. Common errors: `BadRequestError`, `UnauthorizedError`, `InternalServerError`.

The `createRouteHandler` automatically handles error parsing and response formatting.

---

## Example Service Implementation

**1. Add query key:**

```ts
// config.ts
export const keys = {
  base: ["products"],
  listProducts: ["products", "listProducts"],
};
```

**2. Schema:**

```ts
// schema.ts
export const listProductsSchema = z.object({
  cursor: z.coerce.number().nullable(),
  limit: z.coerce.number().nullable(),
});
export type ListProductsSchema = z.infer<typeof listProductsSchema>;
```

**3. Types:**

```ts
// types.d.ts
export declare namespace Products {
  type Product = { id: number; name: string /* ... */ };
  type ListProducts = API.InfiniteListResult<Product>;
}
```

**4. Handler:**

```ts
// handler.ts
export async function listProducts(params: ListProductsSchema): Promise<Products.ListProducts> {
  const { cursor = 1, limit = 10 } = params;
  const result = await db.query.products.findMany(/* ... */);
  return { results: result, nextCursor: /* ... */ };
}
```

**5. Query:**

```ts
// query.ts
export const listProductsOptions = () =>
  infiniteQueryOptions({
    queryKey: keys.listProducts,
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(`/api/products?cursor=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
```

**6. Route:**

```ts
// route.ts
async function getHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || null;
  const limit = searchParams.get("limit") || null;

  const parsed = listProductsSchema.safeParse({ cursor, limit });
  if (!parsed.success) throw new BadRequestError("Invalid params");

  return await listProducts(parsed.data);
}

export const GET = createRouteHandler(getHandler);
```
