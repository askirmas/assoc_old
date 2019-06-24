declare module index {
  export function assoc2table(
    assoc : object,
    options? : object,
    space? : string[],
    table? : string[][]
  ) : string[][]
}