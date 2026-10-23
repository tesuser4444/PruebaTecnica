import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { Readable } from 'node:stream';
import test from 'node:test';
import axios from 'axios';

const require = createRequire(import.meta.url);
const axiosRequire = createRequire(require.resolve('axios'));
const FormData = axiosRequire('form-data');

test('Axios sends JSON, native multipart and streamed multipart without changing data', async () => {
  const server = createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      if (req.headers['content-type'].startsWith('application/json')) {
        res.end(JSON.stringify(JSON.parse(body)));
        return;
      }
      const form = await new Response(body, { headers: { 'content-type': req.headers['content-type'] } }).formData();
      const file = form.get('file');
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ name: form.get('name'), tags: form.getAll('tag'), filename: file.name, bytes: [...new Uint8Array(await file.arrayBuffer())] }));
    } catch (error) {
      res.statusCode = 400;
      res.end(String(error));
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  const bytes = Buffer.from([0, 255, 13, 10, 128, 42]);
  try {
    const config = { proxy: false, timeout: 5000 };
    assert.deepEqual((await axios.post(url, { email: 'test@example.com', name: 'José' }, config)).data, { email: 'test@example.com', name: 'José' });
    for (const native of [false, true]) {
      const form = native ? new globalThis.FormData() : new FormData();
      form.append('name', 'José');
      form.append('tag', 'one');
      form.append('tag', 'two');
      if (native) form.append('file', new Blob([bytes]), 'prueba.bin');
      else form.append('file', Readable.from([bytes]), { filename: 'prueba.bin', contentType: 'application/octet-stream', knownLength: bytes.length });
      const response = await axios.post(url, form, { ...config, headers: native ? {} : form.getHeaders() });
      assert.deepEqual(response.data, { name: 'José', tags: ['one', 'two'], filename: 'prueba.bin', bytes: [...bytes] });
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
