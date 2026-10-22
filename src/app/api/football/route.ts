import { unitedNow } from "@/components/v2/football";

// the card polls this while a match is on
export const revalidate = 30;

export async function GET() {
  return Response.json(await unitedNow(30));
}
