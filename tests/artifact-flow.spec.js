const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('complex backend flow - upload, poll, fetch artifact, download', async ({ request }, testInfo) => {
  const sampleFilePath = path.join(__dirname, '..', 'test-data', 'sample-contract.txt');
  const downloadDir = path.join(__dirname, '..', 'downloads');

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  // 1. Create job
let jobId;
let artifactId;

await test.step('Create Job API', async () => {
  const res = await request.post('http://127.0.0.1:3000/jobs', {
    data: {}
  });

  expect(res.ok()).toBeTruthy();

  const body = await res.json();

  console.log('Create Job Response:', body);

  jobId = body.jobId;
  artifactId = body.artifactId;

  expect(jobId).toBeTruthy();
  expect(artifactId).toBeTruthy();
});

  // 2. Upload file
  await test.step('Upload File API', async () => {
    const res = await request.post(
      `http://127.0.0.1:3000/artifacts/${artifactId}/upload`,
      {
        multipart: {
          file: {
            name: 'sample-contract.txt',
            mimeType: 'text/plain',
            buffer: fs.readFileSync(sampleFilePath)
          }
        }
      }
    );
  
    expect(res.ok()).toBeTruthy();
  
    const body = await res.json();
    console.log('Upload Response:', body);
  
    expect(body.status).toBe('PROCESSING');
  });

  // 3. Poll job until completed
  await test.step('Poll Job Status', async () => {
    await expect.poll(async () => {
      const res = await request.get(
        `http://127.0.0.1:3000/jobs/${jobId}`
      );
  
      const body = await res.json();
  
      console.log('Polling Status:', body.status);
  
      return body.status;
    }, {
      timeout: 15000,
      intervals: [1000, 2000, 2000]
    }).toBe('COMPLETED');
  });

  // 4. Get artifact metadata
  let artifactData;

  await test.step('Fetch Artifact Metadata', async () => {
    const res = await request.get(
      `http://127.0.0.1:3000/artifacts/${artifactId}`
    );
  
    expect(res.ok()).toBeTruthy();
  
    artifactData = await res.json();
  
    console.log('Artifact Data:', artifactData);
  
    expect(artifactData.status).toBe('COMPLETED');
  });

  // 5. Download generated artifact
  let downloadedFilePath = path.join(downloadDir, artifactData.outputFileName);

  await test.step('Download Artifact', async () => {
    const res = await request.get(
      `http://127.0.0.1:3000/artifacts/${artifactId}/download`
    );
  
    expect(res.ok()).toBeTruthy();
  
    const buffer = await res.body();
  
    fs.writeFileSync(downloadedFilePath, buffer);
  });

  // 6. Validate downloaded file
  await test.step('Validate Downloaded File', async () => {
    const content = fs.readFileSync(downloadedFilePath, 'utf-8');
  
    console.log('Downloaded Content:\n', content);
  
    expect(content).toContain(`artifactId=${artifactId}`);
    expect(content).toContain(`jobId=${jobId}`);
    expect(content).toContain('processed successfully');
  });

  await testInfo.attach('downloaded-file', {
    path: downloadedFilePath,
    contentType: 'text/plain'
  });  

});

