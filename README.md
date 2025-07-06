## Zoe Store

### TODOS:

- [] Sort/search by tags (Combined search with text query)
- [] Sort by creation/edit date
- [] Add images to tags
- [] Render tags in homepage
- [] Rich-text for product description
- [] Multiple images per product, carousel on details page
- [] Add analytics

This is the repository for the Brazillian storefront called Zoe Store. This website does not have cart/checkout functionality, it's as simple as just rendering all products from the store, with a private dashboard where managers can add/remove products.

---

> **Note for AI/Contributors:**  
> Always follow the patterns and folder structure described here. Reuse schemas and types, and never bypass validation or type inference. If in doubt, refer to the checklist below.

---

### Project Structure and Conventions

- **Domains:** Each business domain (e.g., Products, Authentication) has its own folder under `src/query/`.
- **Service Structure:** Each service (endpoint) within a domain has its own folder, containing:
  - `schema.ts` (Zod schema + type for input)
  - `handler.ts` (business logic, always using the schema/type)
  - `query.ts` or `mutation.ts` (React Query integration)
- **Types:** All return types must be declared in the domain's `types.d.ts` namespace. Never inline types in handlers or routes.
- **Naming:**
  - Service folders/files: `camelCase`
  - Types: namespaced under the domain

#### Example Domain Structure

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

### Checklist: Adding a New Service (Endpoint)

1. **Add a query/mutation key** in the relevant domain's `config.ts`.
2. **Create a Zod schema** and type in `schema.ts` for input validation.
3. **Declare the return type** in the domain's `types.d.ts` namespace.
4. **Implement the handler** in `handler.ts`, always using the schema and return type.
5. **Create a query.ts or mutation.ts** for React Query integration.
6. **Write the route handler** in `/api/[domain]/[service]/route.ts`, using the schema, handler, and error/success response utilities.

> - **Never** redefine schemas or types inline in handlers or routes. Always import from the domain's `schema.ts` and `types.d.ts`.

---

### Admin-Only Endpoints

If an endpoint is admin-only (e.g., product management), you **must** check admin status at the top of the route handler using `checkAdminKey`. If not admin, throw `UnauthorizedError` before proceeding:

```ts
export async function POST(
  req: NextRequest
): Promise<API.Response<Products.AddProduct>> {
  try {
    // Always check admin first:
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();
    // ...existing code...
  } catch (error) {
    return parseErrorResponse(error);
  }
}
```

---

### React Query Usage (Important)

- **Always use `mutateAsync` for mutations.**
- **Never use `onSuccess`, `onError`, or `useEffect` for mutation side effects.**
- Handle mutation results and errors inside the form's submit handler (async function):

```ts
const { mutateAsync: sendPassword, isPending: checkingPassword } = useMutation(
  loginWithAdminKeyOptions()
);

const onSubmit = async (data: LoginWithAdminKeySchema) => {
  try {
    const { success } = await sendPassword(data);
    if (success === true) {
      router.replace("/dashboard");
    }
  } catch (error) {
    toastError(error);
  }
};
```

- **Always use `toastError` in the catch block** to display errors. This utility narrows the error to `BaseError` and ensures consistent error handling UX.

---

### Example: Query Service (GET /api/products)

````ts
import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useInfiniteQuery(listProductsOptions())
 * ```
 */
export const listProductsOptions = (options?: { admin: boolean }) =>
  infiniteQueryOptions({
    queryKey: options?.admin
      ? [...keys.listProducts, "admin"]
      : keys.listProducts,
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(`/api/products?cursor=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
````

```ts
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { listProducts } from "@/query/products/listProducts/handler";
import { listProductsSchema } from "@/query/products/listProducts/schema";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
): Promise<API.Response<Products.ListProducts>> {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") || null;
    const limit = searchParams.get("limit") || null;

    const parsed = listProductsSchema.safeParse({ cursor, limit });

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const { cursor: parsedCursor, limit: parsedLimit } = parsed.data;

    const result = await listProducts({
      cursor: parsedCursor,
      limit: parsedLimit,
    });

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
```

---

### Example: Mutation Service (POST /api/products)

```ts
// FILENAME: query/products/addProduct/schema.ts
import z from "zod";

export const addProductSchema = z.object({
  name: z.string(),
  image_url: z.string().url(),
  description: z.string().nullable(),
  price: z.string(),
});

export type AddProductSchema = z.infer<typeof addProductSchema>;
```

```ts
// FILENAME: query/products/types.d.ts
export declare namespace Products {
  // ...existing code...
  type AddProduct = { success: boolean; product: Product };
}
```

```ts
// FILENAME: query/products/addProduct/handler.ts
import "server-only";
import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";

export async function addProduct(
  params: AddProductSchema
): Promise<Products.AddProduct> {
  try {
    const product = await db.insertProduct(params);
    return { success: true, product };
  } catch (error) {
    throw new InternalServerError();
  }
}
```

```ts
// FILENAME: query/products/addProduct/mutation.ts
import { keys } from "../config";
import type { AddProductSchema } from "./schema";
import type { Products } from "../types";
import { $fetch } from "../../core/fetch";

export const addProductOptions = () => ({
  mutationKey: keys.addProduct,
  mutationFn: (data: AddProductSchema) =>
    $fetch<Products.AddProduct>("/api/products", {
      method: "POST",
      body: data,
    }),
});
```

```ts
// FILENAME: app/api/products/route.ts
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { addProduct } from "@/query/products/addProduct/handler";
import { addProductSchema } from "@/query/products/addProduct/schema";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest
): Promise<API.Response<Products.AddProduct>> {
  try {
    // Always check admin first:
    const { isAdmin } = await checkAdminKey();
    if (!isAdmin) throw new UnauthorizedError();

    const body = await req.json();
    const parsed = addProductSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }
    const result = await addProduct(parsed.data);
    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
```

---

### Error Handling

- All errors must extend `BaseError` and be handled in the route handler using `parseErrorResponse`.
- Never throw raw errors from handlers or routes.

---

### Authentication

Authentication works by typing the secret admin password into the login page. Then, the user will have a cookie set with that password, and can access the private pages:

```ts
import "server-only";

import { appConfig } from "@/config";
import { cookies } from "next/headers";

export async function checkAdminKey() {
  const cookiesStore = await cookies();

  /** Authorization is based on the admin key cookie. */
  const hasAdminCookie =
    cookiesStore.get(appConfig.auth.adminKeyCookieName)?.value ===
    process.env.ADMIN_KEY;

  return { isAdmin: hasAdminCookie };
}
```

Usage:

```ts
import { redirect } from "next/navigation";
import { DashboardProductList } from "./_components/DashboardProductList";
import { checkAdminKey } from "@/lib/checkAdminKey";

export default async function DashboardPage() {
  const { isAdmin } = await checkAdminKey();

  // Not admin, should be redirected.
  if (!isAdmin) {
    redirect("/dashboard/login");
  }

  return <DashboardProductList />;
}
```

The Next.js Route Handlers are our backend API. The backend API business logic is defined inside the `src/query` folder. Every new endpoint should have its business logic defined in there first.

Each domain (Example: Products domain, Authentication domain) has its own folder, such as `src/query/products`. Inside it, each service has its own folder with a schema, handler, and query/mutation file.

Example: `GET /api/products` is the endpoint for getting products. First, we add the new query key to `src/query/products/config.ts`:

```ts
export const keys = {
  base: ["products"],
  // GET Products query key:
  listProducts: ["products", "listProducts"],
};
```

Then, we must create the service's folder: `/products/listProducts`. First, we create the Zod schema for our new endpoint. We always define and export schema + type:

```ts
// FILENAME: query/products/listProducts/schema.ts
import z from "zod";

export const listProductsSchema = z.object({
  cursor: z.coerce.number().nullable(),
  limit: z.coerce.number().nullable(),
});

export type ListProductsSchema = z.infer<typeof listProductsSchema>;
```

This schema and type is used in the backend server function `products/listProducts/handle.ts` later.

Now, we must create the types for the service's output (The type for the products list object). We use a pattern of one namespace per domain (Products is one domain). This is how it would look like:

```ts
// FILENAME: query/products/types.d.ts

// PS: "API" is a core namespace with utility types we can re-use.
import { API } from "../core/query";

export declare namespace Products {
  type Product = {
    id: number;
    name: string;
    image_url: string;
    description: string | null;
    price: string;
  };

  // type API.InfiniteListResult is `{ result: TData[], cursor: number | null }`
  type ListProducts = API.InfiniteListResult<Products.Product>;
}
```

Then, we create the handler server function for our service, always specifying the return type, following the types we declared above:

```ts
// FILENAME: query/products/listProducts/handle.ts
import "server-only";

import { db } from "@/query/db";
import { InternalServerError } from "@/query/errors/InternalServerError";
import type { ListProductsSchema } from "./schema";
import type { Products } from "../types";

/** Server-side fetch function. To be used inside Route Handler. */
export async function listProducts(
  params: ListProductsSchema
): Promise<Products.ListProducts> {
  try {
    const { cursor = 1, limit = 10 } = params;

    const result = await db.query.products.findMany({
      where: (product, { gt }) => (cursor ? gt(product.id, cursor) : undefined),
      orderBy: (product, { asc }) => asc(product.id),
      limit: limit || 10,
    });

    const nextCursor =
      result.length === limit ? result[result.length - 1].id : null;

    return {
      results: result,
      nextCursor,
    };
  } catch (error) {
    console.error(error);
    throw new InternalServerError();
  }
}
```

Now we must declare the query.ts or mutation.ts file for interacting the service with React Query. In this case, listProducts is a query, so we create the query.ts file:

````ts
import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Products } from "../types";
import { $fetch } from "@/query/core/fetch";
import { keys } from "../config";

/**
 * Client-side query options. Usage:
 *
 * ```ts
 * useInfiniteQuery(listProductsOptions())
 * ```
 */
export const listProductsOptions = (options?: { admin: boolean }) =>
  infiniteQueryOptions({
    queryKey: options?.admin
      ? [...keys.listProducts, "admin"]
      : keys.listProducts,
    queryFn: async ({ pageParam = 0 }) =>
      $fetch<Products.ListProducts>(`/api/products?cursor=${pageParam}`),
    getNextPageParam: (lastPage) => lastPage?.nextCursor || null,
    initialPageParam: 0,
  });
````

Finally, we can create our route handler. A Route Handler is always just the HTTP wrapper over our service. We use utility functions `parseSuccessResponse` and `parseErrorResponse` to normalize response and errors:

```ts
import { NextResponse } from "next/server";

export function parseSuccessResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data);
}
```

```ts
import { BaseError } from "@/query/errors/BaseError";
import { InternalServerError } from "@/query/errors/InternalServerError";
import { NextResponse } from "next/server";
import { API } from "../query";

export function parseErrorResponse(error: unknown): API.RequestError {
  if (error instanceof BaseError) {
    console.log(" error:", JSON.stringify(error));
    return NextResponse.json(
      {
        error: {
          message: error.message,
          name: error.name,
          status: error.status,
        },
      },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: new InternalServerError() },
    { status: 500 }
  );
}
```

For errors, we have `BaseError` and many Error classes based on that base class (NotAuthorizedError, BadRequestError, etc.) so we can just throw them inside the route handler or the service.

Inside the route handler, we just need to wrap it with try catch, to catch the error and return a NextResponse using the utility `parseErrorResponse`.

This is what a route handler should look like:

- Imports the service
- Has a return type enforced
- Parses the input with the same zod schema
- Wrapped with try/catch, robust error handling
- Parses response success

```ts
import { parseErrorResponse } from "@/query/core/parseResponse/error";
import { parseSuccessResponse } from "@/query/core/parseResponse/success";
import { API } from "@/query/core/query";
import { BadRequestError } from "@/query/errors/BadRequestError";
import { listProducts } from "@/query/products/listProducts/handler";
import { listProductsSchema } from "@/query/products/listProducts/schema";
import type { Products } from "@/query/products/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest
): Promise<API.Response<Products.ListProducts>> {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") || null;
    const limit = searchParams.get("limit") || null;

    const parsed = listProductsSchema.safeParse({ cursor, limit });

    if (!parsed.success) {
      throw new BadRequestError("Parâmetros inválidos.");
    }

    const { cursor: parsedCursor, limit: parsedLimit } = parsed.data;

    const result = await listProducts({
      cursor: parsedCursor,
      limit: parsedLimit,
    });

    return parseSuccessResponse(result);
  } catch (error) {
    return parseErrorResponse(error);
  }
}
```

### Server-side rendering / React Server Components

For React Server Components, we avoid calling the server endpoint, and instead use the handler function directly. This is because if we call the route handler from our server-rendered page, we are doing a round-trip (Since we are already on the server). Not only is this slower, but can lead to issues. So we call handlers directly, and pass the result as props so the React Query hook can receive it as the `initialData` property:

```ts
import { ProductPage } from "@/components/pages/ProductPage";
import { getProductBySlug } from "@/query/products/getProductBySlug/handler";

export default async function ProductById({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Handler directly calls the database, fetches products:
  const product = await getProductBySlug(slug);

  return <ProductPage product={product} />;
}
```

ProductPage code:

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductBySlugOptions } from "@/query/products/getProductBySlug/query";
import { useParams } from "next/navigation";
import type { Products } from "@/query/products/types";

export default function ProductPage({
  product: initialProduct,
}: {
  product: Products.Product | null;
}) {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: product, isLoading } = useQuery({
    ...getProductBySlugOptions(slug),
    enabled: !initialProduct,
    ...(initialProduct && { initialData: initialProduct }),
  });

  // etc...
}
```
