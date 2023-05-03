type Config = {
  pre?: Array<{}>;
  prefix?: String;
};

type Controller = {
  path: String;
  method: String;
  cache?: Boolean | Number;
  pre?: Array<{}>;
  handler: Function;
};

function createServer(
  config: Config,
  controllers: Array<Controller>,
  expressAppInstance: any
);

export { createServer };
