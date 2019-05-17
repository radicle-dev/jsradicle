#!/usr/bin/env node

const req = require('./request.js');

const request = (req, handler) => {
  req.then(function (response) {
    handler(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const run = async () => {
  var machine = "<Add issue machine>";
  var machineId = "monadic/radicle/issue";
  var bla = {":body": "testing", ":comments": [], ":created-at": "2019-04-26T08:18:48Z", ":labels": [], ":modified-at": "2019-04-26T08:18:48Z", ":state": ":open", ":title": "Testing"};
  var res = req.sendSignedCommand(machine, machineId, "create-issue", bla);
  var hhh = (re) => {console.log(re)};
  request(res,hhh);
}

run();
