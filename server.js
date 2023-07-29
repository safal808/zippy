require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const File = require("./models/File");
require("mime");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.DATABASE_URL);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.set("views", path.join(__dirname, "views"));

// Route to handle requests for the faq.ejs file
app.get("/views/faq.ejs", (req, res) => {
  res.render("faq");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);

  const fileLink = `${req.headers.origin}/file/${file.id}`;

  res.render("index", { fileLink: fileLink });
});

app.get("/file/:id/download", async (req, res) => {
  const file = await File.findById(req.params.id);

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);

  res.download(file.path, file.originalName);
});

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);

  if (file.expiresAt < new Date()) {
    res.render("expired");
    return;
  }

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
      return;
    }
  }

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);

  res.render("consent", { file: file });
}

app.route("/file/:id").get(handleDownload).post(handleDownload);

// Schedule the cron job to run every day at 00:00 (midnight)
cron.schedule("0 0 * * *", async () => {
  try {
    // Find and delete expired files
    const expiredFiles = await File.deleteExpiredFiles();
    // Delete the files from the filesystem
    for (const file of expiredFiles) {
      fs.unlinkSync(file.path);
    }
    console.log(`${expiredFiles.length} expired files deleted.`);
  } catch (err) {
    console.error("Error deleting expired files:", err);
  }
});

app.listen(process.env.PORT);
