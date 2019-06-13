#!/usr/bin/env node

var Machine = require('./machine.js').Machine;

const success = (res) => {
  console.log(res.find(function (r) {return r[':type']==r[':rad-issue']}))
};

const errorHandler = (error) => {
  console.log(error.message);
  if (error.response) console.log(error.response.data);
}

const request = (req) => {
  req.then(function (response) {
    success(response);
  })
  .catch(function (error) {
    errorHandler(error);
  });
}

const run = async () => {
  var project = "12D3KooWFuTdLBwbe2J9b1NswhoiLT8NhzXvaaC85eyaGLusvZeU";
  var projectId = "monadic/radicle/project";
  var proj = new Machine(project, projectId)
  var payload = {":body": "testing", ":comments": [], ":created-at": "2019-04-26T08:18:48Z", ":labels": [], ":modified-at": "2019-04-26T08:18:48Z", ":state": ":open", ":title": "Testing"};
  return proj.query("(list-rsms)")
  .then(function(re) {
    return re.find(function(elem) {return elem[':type'] === ':rad-issue'})[':id']
  })
  .then(function(re) {
    var issue = new Machine(re, "monadic/radicle/issue")
    issue.sendSignedCommand("create-issue", payload).then(function(bb) {console.log(bb)})
    // issue.query("(list-issues)").then(function(bb) {console.log(bb)})
  })
}

run();
