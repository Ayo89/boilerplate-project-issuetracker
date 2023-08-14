const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let savedIssueId;

suite("Functional Tests", function () {
  test("post project test", function (done) {
    chai
      .request(server)
      .post("/api/issues/project2")
      .send({
        issue_title: "Test Issue",
        issue_text: "This is a test issue",
        created_by: "Tester",
        assigned_to: "Joe",
        status_text: "In progress",
      })
      .end(function (err, res) {
        savedIssueId = res.body._id
        assert.property(res.body, "issue_title");
        assert.property(res.body, "issue_text");
        assert.property(res.body, "created_by");
        assert.property(res.body, "assigned_to");
        assert.property(res.body, "status_text");
        assert.equal(res.body.issue_title, "Test Issue");
        assert.equal(res.body.issue_text, "This is a test issue");
        assert.equal(res.body.created_by, "Tester");
        assert.equal(res.body.assigned_to, "Joe");
        assert.equal(res.body.status_text, "In progress");
        done();
      });
  });

  test("get project test", function (done) {
    chai
      .request(server)
      .get("/api/issues/project2")
      .end(function (err, res) {
        res.body.forEach((project) => {
          assert.property(project, "issue_title");
          assert.property(project, "issue_text");
          assert.property(project, "issue_text");
          assert.property(project, "assigned_to");
          assert.property(project, "status_text");
        });
        done();
      });
  });

  test("put project test", function (done) {
    chai
      .request(server)
      .put(`/api/issues/${savedIssueId}`)
      .send({
        issue_title: "Test Issue2",
        issue_text: "This is a test issue2",
        created_by: "Tester2",
        assigned_to: "Joe2",
        status_text: "In progress2",
      })
      .end(function (err, res) {
        assert.property(res.body, "issue_title");
        assert.property(res.body, "issue_text");
        assert.property(res.body, "created_by");
        assert.property(res.body, "assigned_to");
        assert.property(res.body, "status_text");
        assert.equal(res.body.issue_title, "Test Issue2");
        assert.equal(res.body.issue_text, "This is a test issue2");
        assert.equal(res.body.created_by, "Tester2");
        assert.equal(res.body.assigned_to, "Joe2");
        assert.equal(res.body.status_text, "In progress2");
        done();
      });
  });
  test("delete issue test", function (done) {
    chai
      .request(server)
      .delete(`/api/issues/${savedIssueId}`)
      .end(function (err, res) {
        assert.equal(res.body.message, "Issue eliminado exitosamente.");
        done();
      });
  });
});
