"use strict";

module.exports = function (app) {
  const Issue = require("../models/Issue");

  app
    .route("/api/issues/:project")

    .post(async function (req, res) {
      let project = req.params.project;

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.status(200).json({ error: "required field(s) missing" });
      }

      try {
        let newIssue = new Issue({
          ...req.body,
          project: project,
          open: req.body.open || true, // Default value for open
          created_on: new Date(),
          updated_on: new Date(),
          assigned_to: req.body.assigned_to || "", // Ensure assigned_to is present
          status_text: req.body.status_text || "", // Ensure status_text is present
        });
        const savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (error) {
        return res.status(200).json({ error: "required field(s) missing" });
      }
    })

    .get(async function (req, res) {
      let project = req.params.project;
      let query = { project: project };

      // Copia todas las queries existentes al objeto de consulta
      Object.keys(req.query).forEach((key) => {
        if (key === "open") {
          query.open = req.query.open === "true";
        } else {
          query[key] = req.query[key];
        }
      });

      try {
        const issues = await Issue.find(query);
        return res.json(issues);
      } catch (error) {
        console.error(error);
        return res.status(200).send("Error al obtener los issues.");
      }
    })

    .put(async function (req, res) {
      let issueId = req.body._id;

      if (!issueId) return res.json({ error: "missing _id" });

      const updateData = { ...req.body };
      delete updateData._id; // Eliminamos _id de la lista de campos a actualizar

      if (Object.keys(updateData).length === 0) {
        return res.json({ error: "no update field(s) sent", _id: issueId });
      }

      try {
        let updatedIssue = await Issue.findByIdAndUpdate(
          issueId,
          { ...updateData, updated_on: new Date() },
          {
            new: true,
          }
        );
        if (!updatedIssue)
          return res.json({ error: "could not update", _id: issueId });
        res.json({ result: "successfully updated", _id: issueId });
      } catch (error) {
        console.error(error);
        res.json({ error: "could not update", _id: issueId });
      }
    })

    .delete(async function (req, res) {
      let issueId = req.body._id;
      if (!issueId) return res.json({ error: "missing _id" });

      try {
        let deletedIssue = await Issue.findByIdAndDelete(issueId);
        if (!deletedIssue)
          return res.json({ error: "could not delete", _id: issueId });
        res.json({ result: "successfully deleted", _id: issueId });
      } catch (error) {
        console.error(error);
        res.json({ error: "could not delete", _id: issueId });
      }
    });
};
