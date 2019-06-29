//declare module common {
  export function isEmpty(obj: any) :boolean
  export function deleting(source: [] | object, key: string | number) :void
  export function forEachKey(source: [] | object, fn: (value: any) => void) :void
/*}
export = common*/