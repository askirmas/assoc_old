export interface iOptions {
  delimiter?: string,
  putDelimiter?: boolean,
  splitKeys?: boolean,
  splitLeaves?: boolean,
  keepBlank?: boolean,
  stringRow?: boolean
}
export interface iOptionsDefaults extends iOptions {
  delimiter: string,
  putDelimiter: boolean,
  splitKeys: boolean,
  splitLeaves: boolean,
  keepBlank: boolean,
  stringRow: boolean
}