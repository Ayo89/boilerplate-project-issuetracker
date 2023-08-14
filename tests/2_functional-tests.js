const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {


  test("post project test", function (done) {
    chai
      .request(server)
      .post("/api/issues/project1")
      .send({
        issue_title: "Test Issue",
        issue_text: "This is a test issue",
        created_by: "Tester",
        assigned_to: "Joe",
        status_text: "In progress",
      })
      .end(function (err, res) {
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
        .get("/api/issues/blabla")
        .end(function (err, res) {
          assert.property(res.body, "issue_title");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "status_text");
          done();
        });
    });
});
