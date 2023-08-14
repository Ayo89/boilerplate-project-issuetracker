const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const mongoose = require('mongoose')

chai.use(chaiHttp);

let savedIssueId;

suite("Functional Tests", function () {
  // Post every fields
  test("post project test", function (done) {
    chai
      .request(server)
      .post("/api/issues/project4")
      .send({
        issue_title: "Test Issue",
        issue_text: "This is a test issue",
        created_by: "Tester",
        assigned_to: "Joe",
        status_text: "In progress",
      })
      .end(function (err, res) {
        savedIssueId = res.body._id;
        assert.property(res.body, "issue_title");
        assert.property(res.body, "issue_text");
        assert.property(res.body, "created_by");
        assert.property(res.body, "assigned_to");
        assert.property(res.body, "status_text");
        assert.property(res.body, "_id");
        assert.equal(res.body.issue_title, "Test Issue");
        assert.equal(res.body.issue_text, "This is a test issue");
        assert.equal(res.body.created_by, "Tester");
        assert.equal(res.body.assigned_to, "Joe");
        assert.equal(res.body.status_text, "In progress");
        done();
      });
  });

  // Post with only required fields
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/proyect4")
      .send({
        issue_title: "testing short",
        issue_text: "testing body",
        created_by: "testing short",
      })
      .end(function (err, res) {
        assert.equal(res.body.issue_title, "testing short");
        assert.equal(res.body.issue_text, "testing body");
        assert.equal(res.body.created_by, "testing short");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        assert.property(res.body, "created_on");
        assert.property(res.body, "updated_on");
        assert.property(res.body, "_id");
        done();
      });
  });

  // Post issue with missing required fields
   test('Create and issue with missing required fields',function(done){
            chai.request(server)
            .post('/api/issues/project4')
            .send({
                issue_title: 'testing2',
                issue_text: 'testing body text'
            })
            .end(function(err, res){
                //res.text refers to the string sent alongside an error status code!
                assert.equal(res.body.error,'required field(s) missing');
                done();
              });
          })


  // Get all issues
  test("get project test", function (done) {
    chai
      .request(server)
      .get("/api/issues/project4")
      .end(function (err, res) {
        res.body.forEach((project) => {
          assert.property(project, "issue_title");
          assert.property(project, "issue_text");
          assert.property(project, "created_by");
          assert.property(project, "assigned_to");
          assert.property(project, "status_text");
          assert.property(project, "_id");
        });
        done();
      });
  });

//Get with one filter

      test("view issues on a project with one filter", (done) => {
        chai
          .request(server)
          .get("/api/issues/project4")
          .query({ issue_title: "testing2" })
          .end(function (err, res) {
            assert.isArray(res.body);
            res.body.forEach((issue) => {
              assert.property(issue.issue_title, "issue_title");
            })
            done();
          });
      });

//Get with multiple filters

 test('view issue on a project with multiple filters',(done)=>{
            chai
              .request(server)
              .get("/api/issues/project4")
              .query({
                issue_title: "testing short",
                issue_text: "testing body",
                created_by: "testing short"
              })
              .end(function (err, res) {
                assert.isArray(res.body);
                res.body.forEach((issue) => {
                  assert.property(issue, "issue_title");
                  assert.property(issue, "issue_text");
                  assert.property(issue, "created_by");
                });
                done();
              });
      })

//Update multiple fields
  test("put project test", function (done) {
    chai
      .request(server)
      .put("/api/issues/project4")
      .send({
        _id: savedIssueId,
        issue_title: "Test Issue2",
        issue_text: "This is a test issue2",
        created_by: "Tester2",
        assigned_to: "Joe2",
        status_text: "In progress2",
      })
      .end(function (err, res) {
        assert.property(res.body, "result");
        assert.property(res.body, "_id");
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, savedIssueId);
        done();
      });
  });

  //Update one field
  test("update on field on an issue", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: savedIssueId,
        issue_title: "put works!",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, savedIssueId);
        done();
      });
  });

  //Update missing id
        test("update an issue with missing _id", (done) => {
          chai
            .request(server)
            .put("/api/issues/project4")
            .send({})
            .end(function (err, res) {
              assert.equal(res.body.error, "missing _id");
              done();
            });
        });

  //Update an issue with no fields to update
        test("update an issue with no fields to update", (done) => {
          chai
            .request(server)
            .put("/api/issues/project4")
            .send({
              _id: savedIssueId,
            })
            .end(function (err, res) {
              assert.equal(res.body.error, "no update field(s) sent");
              done();
            });
        });

  //Update with invalid id
        test('update an issue with invalid _id',(done)=>{
            chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id:new mongoose.Types.ObjectId(),
                issue_text: 'sadsada'
            })
            .end(function(err, res){
                assert.equal(res.body.error,'could not update');
                done();
            });
      })

//delete a issue
  test("delete issue test", function (done) {
    chai
      .request(server)
      .delete("/api/issues/project4")
      .send({ _id: savedIssueId })
      .end(function (err, res) {
        assert.property(res.body, "result");
        assert.property(res.body, "_id");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, savedIssueId);
        done();
      });
  });
});

//Delete issue invalid _id
    test("Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({ _id: new mongoose.Types.ObjectId() })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });

//Delete issue missing _id
test("Delete an issue with missing _id", (done) => {
  chai
    .request(server)
    .delete("/api/issues/test")
    .send({})
    .end(function (err, res) {
      assert.equal(res.body.error, "missing _id");
      done();
    });
});

teardown(function () {
  chai.request(server).get("/");
});
