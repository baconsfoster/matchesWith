# MatchesWith
A simple pattern matching library

```
yarn add @baconsfoster/matchesWith

// or

npm install --save @baconsfoster/matchesWith
```

## Overview

 Provides:

 * `matchesWith` : the pattern matching function
 * `MatchesWith` : A class with both a static and instance member assigned the pattern matching function
 * `Any`         : A default-case predicate
 * `isInstanceOf`: A function that returns a predicate for a given class constructor
 * `isTypeOf`    : A function that returns a predicate for a given string based on the `typeof` operator

 ### Examples:

 ```javascript
 class ErrorA{}
 class ErrorB{}

 const isErrorA = isInstanceOf(ErrorA);
 const isErrorB = isInstanceOf(ErrorB);

 const isNumber = isTypeOf('number');
 const isBoolean = isTypeOf('boolean');

try {
  await someFunctionThatCouldThrowManyDifferentErrors();
  await someOtherFunctionThatMightThrowAStringOrNumber();
} catch (e) {
  matchesWith(e, [
    [isErrorA, () => console.log('e is of type ErrorA')],
    [isErrorB, () => console.log('e is of type ErrorB')],
    [isNumber, () => console.log(`e is a number: ${e})`],
    [isBoolean, () => console.log('who throws booleans?')],
    [Any, () => console.log('this is the generic fallback handler')]
  ]);
}
 ```

 Note that the order of predicates matters:

 ```javascript
matchesWith(val, [
  [Any, () => console.log('`Any` matches anything, so the rest aren\'t tested')],
  [somethingElse, () => console.log('can never be reached')]
])
 ```

 Note that `matchesWith` returns the value of invoking the matched clause. If no cases are matched, NO_MATCH is returned instead.

 ```javascript
import { matchesWith, isTypeof, NO_MATCH } from '@baconsfoster/matchesWith';

const isString = isTypeOf('string');

const x = matchesWith(true, [
  [isString, () => 'a string was matched']
]);

x === NO_MATCH; // true
 ```

 ## Inheriting and Mixing In matching

 `MatchesWith` is a class that can be utilized for inheritance or mixing in. Examples:

 ```javascript
class BaseClass extends MatchesWith {}

BaseClass.matchesWith(someVal, [
  // ... predicate clauses
]);

const test = new BaseClass();

test.matchesWith([
  // predicate clauses tested against the 'test' variable (i.e. self)
]);
 ```

 This is mostly handy where you are operating on a sum type- say a value that is one of several child classes. For example:

 ```javascript
class BaseClass extends MatchesWith{}
class ChildA extends BaseClass{}
class ChildB extends BaseClass{}

function returnChildAOrB() { /* returns either an instance of ChildA or ChildB */}

const test = returnChildAOrB();
test.matchesWith(test, [
  [isChildA, () => console.log('got child a')],
  [isChildB, () => console.log('got child b')]
]);
 ```

### TypeScript Caveats and Using as a Mixin

Rather than inheriting from MatchesWith, which may not be practical, you can use `implements` in TypeScript
to treat the class's public members as an interface; from there, you just copy them over. Example:

```javascript
class B implements MatchesWith {
  static matchesWith = MatchesWith.matchesWith;

  matchesWith = MatchesWith.prototype.matchesWith;
}
```

This way, you can get both a parent from a different inheritance chain while "mixing in" the MatchesWith
behavior, if so desired.
