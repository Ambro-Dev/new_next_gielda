import { createNextRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

import { ourFileRouter } from "./core";
import { NextRequest, NextResponse } from "next/server";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

const utapi = new UTApi();

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const { name, url, key } = body;

  if (!name || !url || !key) {
    return NextResponse.json(
      {
        error: "name, url and key are required",
      },
      { status: 400 }
    );
  }

  const response = await utapi.deleteFiles(key);

  if (!response) {
    return NextResponse.json(
      {
        error: "file not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(response);
}
