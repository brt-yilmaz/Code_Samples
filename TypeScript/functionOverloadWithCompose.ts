export function compose<Input, FirstArg>(func: (arg: Input) => FirstArg): (input: Input) => FirstArg;
export function compose<Input, FirstArg, SecondArg>(
  func: (arg: Input) => FirstArg,
  func2: (arg: FirstArg) => SecondArg
): (input: Input) => SecondArg;

export function compose<Input, FirstArg, SecondArg, ThirdArg>(
  func: (arg: Input) => FirstArg,
  func2: (arg: FirstArg) => SecondArg,
  func3: (arg: SecondArg) => ThirdArg
): (input: Input) => ThirdArg;

export function compose<Input, FirstArg, SecondArg, ThirdArg, FourthArg>(
  func: (arg: Input) => FirstArg,
  func2: (arg: FirstArg) => SecondArg,
  func3: (arg: SecondArg) => ThirdArg,
  func4: (arg: ThirdArg) => FourthArg
): (input: Input) => FourthArg;

export function compose<Input, FirstArg, SecondArg, ThirdArg, FourthArg, FifthArg>(
  func: (arg: Input) => FirstArg,
  func2: (arg: FirstArg) => SecondArg,
  func3: (arg: SecondArg) => ThirdArg,
  func4: (arg: ThirdArg) => FourthArg,
  func5: (arg: FourthArg) => FifthArg
): (input: Input) => FifthArg;

const addOne = (num: number) => num + 1

const numToString = (num: number) => num.toString()

const stringToNumber = (str: string) => parseInt(str)

// change the order of the functions and see the result
const composeFunc = compose(
  stringToNumber,
  addOne,
  numToString,
)

const composeWith4Args = compose(
  stringToNumber,
  addOne,
  numToString,
  stringToNumber,
  numToString
)




