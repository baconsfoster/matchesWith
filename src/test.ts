import { matchesWith, Any, NO_MATCH, isInstanceOf } from './index';
declare var require: any;
const assert = require('assert');

class TestA {};
class TestB {};

const valA = new TestA();
const valB = new TestB();

// returns the result of calling the match clause for the appropriate class
const test1 = matchesWith(valA, [
  [isInstanceOf(TestA), val => val],
  [isInstanceOf(TestB), () => null]
]);

assert(test1 == valA);

// same as test one, but making sure it didn't just accept the first clause
const test2 = matchesWith(valB, [
  [isInstanceOf(TestA), () => null],
  [isInstanceOf(TestB), (val) => val]
]);

assert(test2 == valB);

// verifying that `Any` works as a fallback predicate
const test3 = matchesWith(1, [
  [isInstanceOf(TestA), () => null],
  [isInstanceOf(TestB), () => null],
  [Any, val => val]
]);

assert(test3 == 1);

// verifies that, when no predicates match, the NO_MATCH symbol is returned
const test4 = matchesWith(true, [
  [isInstanceOf(TestA), () => null],
  [isInstanceOf(TestB), () => null]
]);

assert(test4 == NO_MATCH);

console.log('Tests Pass');
