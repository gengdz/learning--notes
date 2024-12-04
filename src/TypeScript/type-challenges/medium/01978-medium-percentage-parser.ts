/*
  1978 - Percentage Parser
  -------
  by SSShuai1999 (@SSShuai1999) #中等 #template-literal

  ### 题目

  实现类型 PercentageParser<T extends string>。根据规则 `/^(\+|\-)?(\d*)?(\%)?$/` 匹配类型 T。

  匹配的结果由三部分组成，分别是：[`正负号`, `数字`, `单位`]，如果没有匹配，则默认是空字符串。

  例如：

  ```ts
  type PString1 = ''
  type PString2 = '+85%'
  type PString3 = '-85%'
  type PString4 = '85%'
  type PString5 = '85'

  type R1 = PercentageParser<PString1> // expected ['', '', '']
  type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
  type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
  type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
  type R5 = PercentageParser<PString5> // expected ["", "85", ""]
  ```

  > 在 Github 上查看：https://tsch.js.org/1978/zh-CN
*/

/* _____________ 你的代码 _____________ */

// type PercentageParser<A extends string, R extends string[] = []> = A extends `${infer A}${infer B}`
//   ? A extends '+' | '-' | ''
//     ? PercentageParser<B, [A]>
//     : A extends 1 | 0
//       ? PercentageParser<B, [R[0], `${R[1]}${A}`]>
//       : A extends '%'
//         ? [R[0], R[1], `${R[2]}${A}`]
//         : [R[0], R[1], `${R[2]},""`]
//   : R;

type PercentageParser<A extends string> = A extends `${infer Num}%`
  ? [...NumberParser<Num>, '%']
  : [...NumberParser<A>, ''];

type NumberParser<A extends string> = A extends `${infer Sign extends '+' | '-'}${infer Num}`
  ? [Sign, Num]
  : ['', A];

type a = PercentageParser<'+10%'>;

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils';

type Case0 = ['', '', ''];
type Case1 = ['+', '', ''];
type Case2 = ['+', '1', ''];
type Case3 = ['+', '100', ''];
type Case4 = ['+', '100', '%'];
type Case5 = ['', '100', '%'];
type Case6 = ['-', '100', '%'];
type Case7 = ['-', '100', ''];
type Case8 = ['-', '1', ''];
type Case9 = ['', '', '%'];
type Case10 = ['', '1', ''];
type Case11 = ['', '100', ''];

type cases = [
  Expect<Equal<PercentageParser<''>, Case0>>,
  Expect<Equal<PercentageParser<'+'>, Case1>>,
  Expect<Equal<PercentageParser<'+1'>, Case2>>,
  Expect<Equal<PercentageParser<'+100'>, Case3>>,
  Expect<Equal<PercentageParser<'+100%'>, Case4>>,
  Expect<Equal<PercentageParser<'100%'>, Case5>>,
  Expect<Equal<PercentageParser<'-100%'>, Case6>>,
  Expect<Equal<PercentageParser<'-100'>, Case7>>,
  Expect<Equal<PercentageParser<'-1'>, Case8>>,
  Expect<Equal<PercentageParser<'%'>, Case9>>,
  Expect<Equal<PercentageParser<'1'>, Case10>>,
  Expect<Equal<PercentageParser<'100'>, Case11>>,
];

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答： https://tsch.js.org/1978/answer/zh-CN
  > 查看解答： https://tsch.js.org/1978/solutions
  > 更多题目： https://tsch.js.org/zh-CN
*/
