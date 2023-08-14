"use strict";

module.exports = function (app) {
  const Issue = require("../models/Issue");

  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      let query = { project: project };

      if (req.query.open) {
        query.open = req.query.open === "true";
      }
      if (req.query.assigned_to) {
        query.assigned_to = req.query.assigned_to;
      }

      try {
        const issues = await Issue.find(query);
        return res.json(issues);
      } catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener los issues.");
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      try {
        let newIssue = new Issue({
          ...req.body,
          project: project,
        });
        const savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el issue.");
      }
    })

    .put(async function (req, res) {
      let issueId = req.params.project; 
      console.log(issueId)
      if (!issueId) return res.status(400).send("ID del issue requerido.");

      try {
        let updatedIssue = await Issue.findByIdAndUpdate(issueId, req.body, {
          new: true,
        });
        if (!updatedIssue) return res.status(404).send("Issue no encontrado.");
        res.json(updatedIssue);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar el issue.");
      }
    })

    .delete(async function (req, res) {
      let issueId = req.params.project;
      if (!issueId) return res.status(400).send("ID del issue requerido.");

      try {
        let deletedIssue = await Issue.findByIdAndDelete(issueId);
        if (!deletedIssue) return res.status(404).send("Issue no encontrado.");
        res.json({ message: "Issue eliminado exitosamente." });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el issue.");
      }
    });
};
