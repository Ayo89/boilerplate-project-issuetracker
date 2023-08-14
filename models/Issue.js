// models/Issue.js
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  project: String,
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  open: Boolean,
  created_on: Date,
  updated_on: Date,
});

module.exports = mongoose.model("Issue", issueSchema);
  