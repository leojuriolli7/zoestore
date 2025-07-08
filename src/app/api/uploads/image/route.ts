import { checkAdminKey } from "@/lib/checkAdminKey";
import { createRouteHandler } from "@/query/core/createRouteHandler";
import { UnauthorizedError } from "@/query/errors/UnauthorizedError";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

async function postHandler(request: Request) {
  const { isAdmin } = await checkAdminKey();
  if (!isAdmin) throw new UnauthorizedError();

  const body = (await request.json()) as HandleUploadBody;

  return await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async () => {
      return {
        allowedContentTypes: ["image/*"],
        addRandomSuffix: true,
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      console.log("blob upload completed", blob, tokenPayload);
    },
  });
}

export const POST = createRouteHandler(postHandler);
