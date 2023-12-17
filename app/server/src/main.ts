import fs from 'node:fs'
import * as path from 'node:path';

import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const main = async () => {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  const migration = fs.readFileSync(path.join(__dirname, 'migrate-schema.sql'), 'utf8');
  db.exec(migration);

  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/ping', (req, res) => {
    res.send({ message: 'pong' });
  });

  app.post('/query', (req, res) => {
    const { sql: sqlBody, params, method } = req.body;

    if (method === 'run') {
      try {
        const result = db.prepare(sqlBody).run(params);
        res.send(result);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    } else if (method === 'all' || method === 'values') {
      try {
        const rows = db.prepare(sqlBody).raw().all(params);
        res.send(rows);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    } else if (method === 'get') {
      try {
        const row = db.prepare(sqlBody).raw().get(params);
        res.send(row);
      } catch (e: any) {
        res.status(500).json({ error: e.message });
      }
    } else {
      res.status(500).json({ error: 'Unkown method value' });
    }
  });

  app.post('/migrate', (req, res) => {
    const { queries } = req.body;

    db.exec('BEGIN');
    try {
      for (const query of queries) {
        db.exec(query);
      }

      db.exec('COMMIT');
    } catch (e: any) {
      db.exec('ROLLBACK');
    }

    res.send({});
  });

  const port = process.env.PORT || 9000;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);

};

main();
