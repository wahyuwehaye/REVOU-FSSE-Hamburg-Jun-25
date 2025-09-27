export async function GET() {
  return Response.json({ message: 'pong', time: new Date().toISOString() });
}
