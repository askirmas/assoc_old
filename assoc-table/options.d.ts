declare module "options.json" {
  export interface iOptions {
    delimiter?: string,
    putDelimiter?: boolean,
    splitKeys?: boolean,
    splitLeaves?: boolean,
    keepBlank?: boolean,
  }
  const optionsDefault : iOptions; 
  export default optionsDefault
}
