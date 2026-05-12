const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
const generatedDir = path.join(__dirname, 'generated');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}


const jobs = {};
const artifacts = {};

const upload = multer({ dest: 'uploads/' });

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.post('/jobs', (req, res) => {
  const jobId = makeId('job');
  const artifactId = makeId('artifact');

  jobs[jobId] = {
    jobId,
    artifactId,
    status: 'CREATED'
  };

  artifacts[artifactId] = {
    artifactId,
    jobId,
    inputFileName: null,
    outputFileName: null,
    status: 'AWAITING_UPLOAD'
  };

  res.status(201).json({
    message: 'Job created',
    jobId,
    artifactId,
    status: jobs[jobId].status
  });
});

app.post('/artifacts/:artifactId/upload', upload.single('file'), (req, res) => {
  const artifactId = req.params.artifactId;
  const artifact = artifacts[artifactId];

  if (!artifact) {
    return res.status(404).json({ message: 'Artifact not found' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'File is required' });
  }

  artifact.inputFileName = req.file.originalname;
  artifact.status = 'PROCESSING';

  const job = jobs[artifact.jobId];
  job.status = 'PROCESSING';

  setTimeout(() => {
    const outputFileName = `${artifactId}-report.txt`;
    const outputPath = path.join(__dirname, 'generated', outputFileName);

    const content = [
      `artifactId=${artifactId}`,
      `jobId=${artifact.jobId}`,
      `sourceFile=${artifact.inputFileName}`,
      `result=processed successfully`
    ].join('\n');

    fs.writeFileSync(outputPath, content);

    artifact.outputFileName = outputFileName;
    artifact.status = 'COMPLETED';
    job.status = 'COMPLETED';
  }, 5000);

  res.status(200).json({
    message: 'File uploaded successfully',
    artifactId,
    fileName: req.file.originalname,
    status: artifact.status
  });
});

app.get('/jobs/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  res.json(job);
});

app.get('/artifacts/:artifactId', (req, res) => {
  const artifact = artifacts[req.params.artifactId];

  if (!artifact) {
    return res.status(404).json({ message: 'Artifact not found' });
  }

  res.json(artifact);
});

app.get('/artifacts/:artifactId/download', (req, res) => {
  const artifact = artifacts[req.params.artifactId];

  if (!artifact) {
    return res.status(404).json({ message: 'Artifact not found' });
  }

  if (artifact.status !== 'COMPLETED' || !artifact.outputFileName) {
    return res.status(409).json({ message: 'Artifact not ready for download' });
  }

  const filePath = path.join(__dirname, 'generated', artifact.outputFileName);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log(`Dummy API running at http://localhost:${PORT}`);
});