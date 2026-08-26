import { saveUserProfile } from "@/app/lib/profile/service";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const result = saveUserProfile({
    name: asString(record.name),
    email: asString(record.email),
    timezone: asString(record.timezone),
  });

  if (!result.ok) {
    return Response.json({ errors: result.errors }, { status: 400 });
  }

  return Response.json({ profile: result.profile }, { status: 200 });
}
