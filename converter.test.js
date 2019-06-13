const conv = require('./converter.js');

test('`parseRadicle` works correctly', () => {
  expect(conv.parseRadicle("{:issue \"foo\" :id 123}")).toEqual({":issue": "foo", ":id": 123})
});
