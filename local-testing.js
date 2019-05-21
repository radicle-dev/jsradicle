#!/usr/bin/env node

var {Machine, createMachine} = require('./machine.js');

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
  var machine = new Machine(machine, machineId)
  var payload = {":body": "testing", ":comments": [], ":created-at": "2019-04-26T08:18:48Z", ":labels": [], ":modified-at": "2019-04-26T08:18:48Z", ":state": ":open", ":title": "Testing"};
  // var res = machine.query("(list-rsms)");
  var res = machine.sendUnsignedCommand("anonymous-create-issue", payload)
  var hhh = (re) => {console.log(re)};
  request(res,hhh);
}

run();
