ReN3.ai-style Backend Artifact Automation with Playwright

This project simulates a ReN3.ai-style document processing flow where a file is uploaded, processed asynchronously, linked to an artifactId, and then downloaded and validated by an automated Playwright test. Playwright supports API-driven testing through APIRequestContext, multipart file upload, and retry-based polling assertions, which makes it well suited for this scenario.

What this project demonstrates
Backend workflow automation with Playwright, not just UI clicks.

Multipart file upload using Playwright request APIs.

Async job polling until completion using Playwright assertions.

Artifact metadata validation using jobId and artifactId.

File download and content verification for generated output.

GitHub onboarding with CI execution through GitHub Actions using Playwright's CI guidance.

Scenario covered :
The automated flow covers a realistic end-to-end backend use case:

Create a backend processing job.

Capture the returned jobId and artifactId.

Upload an input file through a multipart API.

Poll the backend until job status becomes COMPLETED.

Fetch artifact metadata.

Download the generated artifact.

Validate the downloaded file content.

This is intentionally more complex than a CRUD demo because it combines asynchronous processing, file handling, status tracking, and output verification in one test flow.

Tech stack: 

Component	Purpose
Node.js + Express	Dummy backend API for upload, polling, artifact generation, and download
Multer	Multipart file upload handling in the backend.
Playwright	API automation, polling, and assertions.
GitHub Actions	CI execution of Playwright tests.
API flow
The dummy backend exposes a minimal but meaningful workflow for automation:

GET /health — health check

POST /jobs — create a job and return jobId and artifactId

POST /artifacts/:artifactId/upload — upload input file

GET /jobs/:jobId — poll for async job status

GET /artifacts/:artifactId — fetch artifact metadata

GET /artifacts/:artifactId/download — download generated artifact

Project structure
text
backendPlaywright-automation/
├── server.js
├── package.json
├── tests/
│   └── artifact-flow.spec.js
├── test-data/
│   └── sample-contract.txt
├── uploads/
├── generated/
├── downloads/
└── .github/
    └── workflows/
How to run locally
1. Install dependencies
bash
npm install
npx playwright install
2. Start the dummy backend
bash
node server.js
The backend should start on port 3000 and expose the health endpoint for local verification.

3. Run the Playwright test
bash
npx playwright test tests/artifact-flow.spec.js
What the Playwright test validates
The automated test performs all core backend checks required for this use case:

Job creation returns valid identifiers.

File upload succeeds through multipart form data.

Polling waits for backend completion using retry logic instead of static sleeps.

Artifact metadata is available after processing.

The generated file is downloadable.

Downloaded content contains the expected artifactId, jobId, and processing result.

GitHub Actions
This project was onboarded to GitHub and executed through GitHub Actions so the workflow can be validated in CI as well as locally. Playwright provides documented CI guidance for running tests in automation pipelines, including GitHub Actions workflows.

A typical workflow includes:

Checkout repository

Setup Node.js

Install dependencies

Install Playwright browsers

Start backend service

Run Playwright test suite

Publish test reports or artifacts