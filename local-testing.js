#!/usr/bin/env node

var {Machine, createMachine} = require('./machine.js');

const success = (res) => {console.log(res)};

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
  var machine = "<Add issue machine>";
  var machineId = "monadic/radicle/issue";
  var machine = new Machine(machine, machineId)
  var payload = {":body": "testing", ":comments": [], ":created-at": "2019-04-26T08:18:48Z", ":labels": [], ":modified-at": "2019-04-26T08:18:48Z", ":state": ":open", ":title": "Testing"};
  var res = machine.sendUnsignedCommand("anonymous-create-issue", payload)
  request(res);
}

run();
