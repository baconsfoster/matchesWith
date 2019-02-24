// Utility MatchesWith class for providing pattern matching as an extension / mixin to
// other classes (both static and instance methods can be used)
// The TypeScript docs have a handy example function here for supporting mixins:
// https://www.typescriptlang.org/docs/handbook/mixins.html
// Sadly, their method- and the `implements` keyword in general- has no support for
// static member mixins, which are necessary if a value might not actually be an instance of a class

export const NO_MATCH = Symbol('pattern match failed');

export const matchesWith = <T>(val: T, matchMap: { [key: string]: (val: T) => any }): any | Symbol => {
  if (!val || !val.constructor) {
    return NO_MATCH;
  };
  const match = matchMap[val.constructor.name];

  if (!match && matchMap.None) {
    return matchMap.None(val);
  } else if (!match) {
    return NO_MATCH;
  }

  return match(val);
}

export class MatchesWith {
  static matchesWith = matchesWith;

  matchesWith<T>(this: T, matchMap: { [key: string]: (val: T) => any }): any | Symbol {
    return MatchesWith.matchesWith<T>(this, matchMap);
  }
}
