# 🎭 ReN3.ai-style Backend Artifact Automation with Playwright

> Backend workflow automation with Playwright, not just UI clicks.

This project simulates a ReN3.ai-style document processing flow where a file is uploaded, processed asynchronously, linked to an artifactId, and then downloaded and validated by an automated Playwright test suite.

---

## 🎯 What This Project Demonstrates

- ✅ **Backend workflow automation** with Playwright, not just UI clicks
- 📤 **Multipart file upload** using Playwright request APIs
- ⏳ **Async job polling** until completion using Playwright assertions
- 🔍 **Artifact metadata validation** using jobId and artifactId
- 📥 **File download and content verification** for generated output
- 🔄 **GitHub Actions CI execution** using Playwright's CI guidance

---

## 📊 Scenario Covered

The automated flow covers a realistic **end-to-end backend use case**:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Create a backend processing job                       │
│ 2. Capture the returned jobId and artifactId            │
│ 3. Upload an input file through a multipart API         │
│ 4. Poll the backend until job status becomes COMPLETED  │
│ 5. Fetch artifact metadata                              │
│ 6. Download the generated artifact                      │
│ 7. Validate the downloaded file content                 │
└─────────────────────────────────────────────────────────┘
```

> **Note:** This is intentionally more complex than a CRUD demo because it combines asynchronous processing, file handling, status tracking, and output verification in one test flow.

---

## 🛠️ Tech Stack

| Component | Purpose |
|-----------|---------|
| **Node.js + Express** | Dummy backend API for upload, polling, artifact generation, and download |
| **Multer** | Multipart file upload handling in the backend |
| **Playwright** | API automation, polling, and assertions |
| **GitHub Actions** | CI execution of Playwright tests |

---

## 🔌 API Flow

The dummy backend exposes a minimal but meaningful workflow for automation:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/jobs` | Create a job and return jobId and artifactId |
| `POST` | `/artifacts/:artifactId/upload` | Upload input file |
| `GET` | `/jobs/:jobId` | Poll for async job status |
| `GET` | `/artifacts/:artifactId` | Fetch artifact metadata |
| `GET` | `/artifacts/:artifactId/download` | Download generated artifact |

---

## 📁 Project Structure

```
backendPlaywright-automation/
├── server.js                 # Express backend server
├── package.json              # Dependencies & scripts
├── tests/
│   └── artifact-flow.spec.js # Main Playwright test
├── test-data/
│   └── sample-contract.txt   # Sample test file
├── uploads/                  # Uploaded files directory
├── generated/                # Generated artifacts directory
├── downloads/                # Downloaded files directory
└── .github/
    └── workflows/            # GitHub Actions workflows
```

---

## 🚀 How to Run Locally

### 1️⃣ Install Dependencies

```bash
npm install
npx playwright install
```

### 2️⃣ Start the Dummy Backend

```bash
node server.js
```

The backend should start on **port 3000** and expose the health endpoint for local verification:
```bash
curl http://localhost:3000/health
```

### 3️⃣ Run the Playwright Test

```bash
npx playwright test tests/artifact-flow.spec.js
```

---

## ✨ What the Playwright Test Validates

The automated test performs all core backend checks required for this use case:

| Validation | Details |
|-----------|---------|
| **Job Creation** | Returns valid identifiers (jobId & artifactId) |
| **File Upload** | Succeeds through multipart form data |
| **Async Polling** | Waits for backend completion using retry logic instead of static sleeps |
| **Metadata Availability** | Artifact metadata is available after processing |
| **File Download** | Generated file is downloadable |
| **Content Verification** | Downloaded content contains expected artifactId, jobId, and processing result |

---

## 🔄 GitHub Actions CI/CD

This project is onboarded to GitHub and executed through GitHub Actions so the workflow can be validated in CI as well as locally. Playwright provides documented CI guidance for running tests in automated environments.

### Typical Workflow Stages:

```
┌──────────────────────────┐
│ 1. Checkout repository   │
├──────────────────────────┤
│ 2. Setup Node.js         │
├──────────────────────────┤
│ 3. Install dependencies  │
├──────────────────────────┤
│ 4. Install Playwright    │
│    browsers              │
├──────────────────────────┤
│ 5. Start backend service │
├──────────────────────────┤
│ 6. Run test suite        │
├──────────────────────────┤
│ 7. Publish test reports  │
└──────────────────────────┘
```

---

## 📝 Notes

- This project is a practical example of backend testing beyond simple CRUD operations
- It demonstrates real-world patterns like async job handling and file processing
- Perfect for learning Playwright's non-UI automation capabilities

---

**Made with ❤️ for backend automation testing**