import { drizzle } from 'drizzle-orm/sqlite-proxy';

import api from './api';
import * as schema from "./schema";

const db = drizzle(
  async (sql, params, method) => {
    try {
      const rows = await api.post('/query', {
        sql,
        params,
        method,
      });
      return { rows: rows.data };
    } catch (e: any) {
      console.error('Error from sqlite proxy server: ', e.response.data);
      return { rows: [] };
    }
  },
  { schema }
);

export default db;