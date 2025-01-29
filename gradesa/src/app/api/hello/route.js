import { DB } from '../../../backend/db';

export async function GET(request) {
  const result = await DB.pool('SELECT now()');
  const now = result.rows[0].now;
  return Response.json({ message: 'Hello!', now });
}
