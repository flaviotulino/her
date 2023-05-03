declare module "handler-express-revised" {
  type Config = {
    pre?: Array<{}>;
    prefix?: String;
  };

  export type Handler = {
    path: String;
    method: String;
    cache?: Boolean | Number;
    pre?: Array<{}>;
    handler: Function;
  };

  export function createServer(
    config: Config,
    handlers: Array<Handler>,
    expressAppInstance: any
  ): void;

  class CustomError {
    status: Number;
    err: String;
    isError = true;
  }

  export function createError(status: Number, err: String): CustomError;
}
