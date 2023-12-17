import { useState } from 'react';
import { eq } from 'drizzle-orm/expressions';

import api from './api';
import db from './db';
import * as schema from './schema';

export function App() {
  const [output, setOutput] = useState("");

  const appendToOutput = (s: string) => {
    setOutput((o) => `${new Date().toISOString()}\n${s}\n\n${o}`)
  };

  const ping = async () => {
    try {
      const res = await api.get('/ping');
      appendToOutput(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error(err);
      appendToOutput("The server is unavailable. Please wait a moment");
    }
  };

  const testProxy = async () => {
    await db.delete(schema.users);
    await db.delete(schema.cities);

    const insertedCity = await db.insert(schema.cities).values({ id: 1, name: 'name' }).returning().get();
    appendToOutput(`insertedCity: ${JSON.stringify(insertedCity)}`);

    const insertedUser = await db.insert(schema.users)
      .values({ id: 1, name: 'name', email: 'email', cityId: insertedCity.id }).run();
    appendToOutput(`insertedUser: ${JSON.stringify(insertedUser)}`);

    const select = await db.select()
      .from(schema.users)
      .leftJoin(schema.cities, eq(schema.users.cityId, schema.cities.id))
      .get();

    appendToOutput(`usersToCityResponse(select): ${JSON.stringify(select)}`);

    const query = await db.query.users.findMany();
    appendToOutput(`usersToCityResponse(query): ${JSON.stringify(query)}`);

    const queryWithRelations = await db.query.users.findMany({
      with: {
        city: true
      }
    });
    appendToOutput(`usersToCityResponse(query + relations): ${JSON.stringify(queryWithRelations)}`);
  };

  return (
    <div>
      <button onClick={ping}>Ping</button>
      <button onClick={testProxy}>Test Proxy</button>
      <hr />
      <pre>{output}</pre>
    </div>
  );
}

export default App;
