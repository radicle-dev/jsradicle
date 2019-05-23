#!/usr/bin/env node

var {Machine, createMachine} = require('./machine.js');

const run = async () => {
  var machine = "<Add issue machine>";
  var machineId = "monadic/radicle/issue";
  var machine = new Machine(machine, machineId)
  var payload = {":body": "testing", ":comments": [], ":created-at": "2019-04-26T08:18:48Z", ":labels": [], ":modified-at": "2019-04-26T08:18:48Z", ":state": ":open", ":title": "Testing"};
  var res = machine.sendUnsignedCommand("anonymous-create-issue", payload)
  res.then((re) => {console.log(re)});
}

run();
