const mongoose = require("mongoose");

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 100 MB in bytes

const FileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  password: String,
  downloadCount: {
    type: Number,
    required: true,
    default: 0,
  },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 1 * 60 * 1000); // Set to 48 hours from now
    },
    index: { expires: "48h" },
  },
  size: {
    type: Number,
    validate: {
      validator: function (value) {
        return value <= MAX_FILE_SIZE;
      },
      message: `File size cannot exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB.`,
    },
  },
});

FileSchema.statics.deleteExpiredFiles = async function () {
  const expiredFiles = await this.find({
    expiresAt: { $lt: new Date() },
  });

  // Delete the documents from the database
  await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });

  return expiredFiles;
};

const File = mongoose.model("File", FileSchema);

module.exports = File;
