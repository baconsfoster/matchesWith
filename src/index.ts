// Utility MatchesWith class for providing pattern matching as an extension / mixin to
// other classes (both static and instance methods can be used)
// The TypeScript docs have a handy example function here for supporting mixins:
// https://www.typescriptlang.org/docs/handbook/mixins.html
// Sadly, their method- and the `implements` keyword in general- has no support for
// static member mixins, which are necessary if a value might not actually be an instance of a class

export const NO_MATCH = 'pattern_match_failed';


export type Predicate<T> = (val: T) => boolean;
export type MatchClause<T, X> = (val: T) => X;

export interface MatchCase<T> extends Array<Predicate<T> | MatchClause<T, any>> {
  0: Predicate<T>;
  1: MatchClause<T, any>;
  length: 2;
}

export const matchesWith = <T>(val: T, cases: MatchCase<T>[]) => {
  for (var i = 0; i < cases.length; i++) {
    if (cases[i][0](val)) {
      return cases[i][1](val);
    }
  }

  return NO_MATCH;
}


export class MatchesWith {
  static matchesWith = matchesWith;

  matchesWith(cases: MatchCase<this>[]): any {
    return MatchesWith.matchesWith<this>(this, cases);
  }
}

// fallback predicate- useful if you want to handle *any* value
export const Any = () => true;

// simple predicate maker. All of the examples below are inlined, though if this were
// to be used in the future, it might be better instead to do something like:
/*
const IsTestA = isInstanceOf(TestA);

// later
matchesWith(val, [
  [IsTestA, value => console.log(value)],
  //....
])
*/
export const isInstanceOf = classFn => val => {
  return val instanceof classFn;
};


// likewise, create predicates for basic types using isTypeOf and the string for the `typeof` match
export const isTypeOf = (type: string) => val => {
  return typeof val === type;
}
