import { matchesWith, NO_MATCH } from './index';
declare var require: any;
const assert = require('assert');

class TestA {};
class TestB {};

const valA = new TestA();
const valB = new TestB();

const test1 = matchesWith(valA, {
  TestA: val => val,
  TestB: () => null
});

assert(test1 == valA);

const test2 = matchesWith(valB, {
  TestA: () => null,
  TestB: val => val
});

assert(test2 == valB);

const test3 = matchesWith(1, {
  TestA: () => null,
  TestB: () => null,
  None: val => val
});

assert(test3 == 1);

console.log('Tests Pass');
