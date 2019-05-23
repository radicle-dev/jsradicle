const conv = require('./converter.js');

const axios = require("axios");
const uuidv4 = require('uuid/v4');
const fs = require("fs");
const blake = require('blakejs');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const radicleDaemonApiUrl = () => {
  var url = process.env.RAD_DAEMON_API_URL;
  return (url === undefined) ? "http://localhost:8909" : url;
}

const machinesUrl = () => {
  return radicleDaemonApiUrl() + "/v0/machines";
}

const machineUrl = (machine) => {
  return machinesUrl() + "/" + machine;
}

const uuid = () => {
  return uuidv4();
}

const basePath = () => {
  var xgd = process.env.XDG_CONFIG_HOME;
  var configPath = (xgd == undefined) ? (process.env.HOME + "/.config") : xgd;
  return configPath + "/radicle";
}

const getKeys = () => {
  var path = basePath() + "/my-keys.rad";
  var data = fs.readFileSync(path, 'utf8');
  return conv.parseRadicle(data);
}

const genSignature = (msg) => {
  var msgHash = blake.blake2b(msg, null, 32);
  var keys = getKeys();
  var pub = {x: keys[":public-key"][1][':public_q'][0], y: keys[":public-key"][1][':public_q'][1]};
  var priv = keys[":private-key"][1][':private_d'];
  var keypair = ec.keyPair({pub: pub, pubEnc: 10, priv: priv, privEnc: 10});
  var signature = keypair.sign(msgHash);
  return [":signature", {":sign_r": signature.r.toString(10), ":sign_s": signature.s.toString(10)}];
}

const signEntity = (entity, machineId) => {
  var nonce = (uuid());
  var e_ = Object.assign({}, entity, {":machine-id": machineId, ":nonce": nonce});
  var ordered_e = {};
  Object.keys(e_).sort().forEach(function(key) {
    ordered_e[key] = e_[key];
  });
  var keys = getKeys();
  var e_Obj = conv.toRadicle(ordered_e);
  var sig = genSignature(e_Obj);
  return Object.assign({}, ordered_e, {":author": keys[":public-key"], ":signature": sig});
}

// TODO: return as Machine with machine id
// create a new machine. returns the new machine id
createMachine = async function() {
  var url = machinesUrl() + "/new"
  try {
    var req = await axios.post(url);
    return req.data.machineId
  } catch(error) {
    console.log(error.message);
    if (error.response) console.log(error.response.data);
  }
}

function Machine(machine, machineId) {
  this.machine = machine;
  this.url = machineUrl(machine);
  this.machineId = machineId;
}

// cmds: ["(radicle expr)", "(radicle expr)", ...]
Machine.prototype.send = async function(cmds) {
  var url = this.url + "/send";
  try {
    var req = await axios.post(url, {
      expressions: cmds
    });
    return conv.parseRadicle(req.data.results);
  } catch(error) {
    console.log(error.message);
    if (error.response) console.log(error.response.data);
  }
}

// only works for issue machines updated according to https://github.com/radicle-dev/radicle/pull/629
// cmd: String of radicle command
// payload: Obj
// The command extends the `send` command for machines that require a nonce.
Machine.prototype.sendUnsignedCommand = function(cmd, payload) {
  var unsigObj = Object.assign({}, payload, {":machine-id": this.machineId, ":nonce": uuid(), ":author": ":anonymous"})
  var cmds = ["(" + cmd + " " + conv.toRadicle(unsigObj) + ")"];
  return this.send(cmds);
}

// cmd: String of radicle command
// payload: Obj
// The command extends the `send` command for machines that require a nonce and
// a signature.
Machine.prototype.sendSignedCommand = function(cmd, payload) {
  var sigObj = signEntity(payload, this.machineId);
  var cmds = ["(" + cmd + " " + conv.toRadicle(sigObj) + ")"];
  return this.send(cmds);
}

// cmd: "(radicle expr)"
Machine.prototype.query = async function(cmd) {
  var url = this.url + "/query";
  try {
    var req = await axios.post(url, {
      expression: cmd
    });
    return conv.parseRadicle(req.data.result);
  } catch(error) {
    console.log(error.message);
    if (error.response) console.log(error.response.data);
  }
}

module.exports = {Machine, createMachine};
