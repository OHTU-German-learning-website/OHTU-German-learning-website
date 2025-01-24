import { query } from '../../../backend/db';

export async function GET(request) {
  const result = await query('SELECT now()');
  const now = result.rows[0].now;
  return Response.json({ message: 'Hello, world!', now });
}
