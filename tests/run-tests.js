import request from 'supertest';
import app from '../src/app.js';

async function run() {
  console.log('Running minimal developer API sanity tests...');

  const missingId = '00000000-0000-0000-0000-000000000000';
  try {
    const res = await request(app).get(`/api/v1/developers/${missingId}`);
    if (res.status === 404) {
      console.log('✅ GET /api/v1/developers/:id returned 404 for non-existing id (expected)');
      process.exit(0);
    } else {
      console.error('❌ Unexpected response status:', res.status, res.text);
      process.exit(2);
    }
  } catch (err) {
    console.error('❌ Tests failed with error:', err);
    process.exit(1);
  }
}

run();
