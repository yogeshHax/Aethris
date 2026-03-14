export async function GET() {

  const openRate = Math.floor(Math.random() * 20) + 10;
  const clickRate = Math.floor(Math.random() * 8) + 2;

  return Response.json({
    openRate,
    clickRate
  });
}