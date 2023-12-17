# Steps to reproduce

```shell
npm install
npm start
```

The client will be available at [http://localhost:4200/](http://localhost:4200/)

Clicking the TestProxy button will execute the testProxy function in `app/client/src/app/app.tsx`

There are 2 projects available in the repository: `app/client` and `app/server`. The database used is in-memory better-sqlite3.

Database migration is located in `app/server/src/migrate-schema.sql`
