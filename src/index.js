import NodeCache from "node-cache";
const MemoryCache = new NodeCache();

function createError(status, err) {
  return {
    isError: true,
    status,
    err,
  };
}

function createHandler(handler) {
  return handler;
}

function createServer(config, handlers, app) {
  handlers.forEach((controllerHandler) => {
    const globalPreMiddlewars = config.pre || [];

    const {
      method,
      handler,
      path,
      pre = [],
      cache = false,
      schema = false,
    } = controllerHandler;

    if (!handler) {
      console.log("You must define a handler function");
      process.exit(-1);
    }

    if (!path) {
      console.log("You must define a path");
      process.exit(-1);
    }

    const preMiddlewares = [...globalPreMiddlewars, ...pre];
    const prefix = config.prefix || "";
    const normalisedPath = `/${prefix}/${path}`.replace(/\/+/g, "/");

    app[method.toLowerCase()](normalisedPath, async (request, response) => {
      try {
        if (schema) {
          const { error } = schema.validate(request, { allowUnknown: true });
          if (error) throw createError(400, error.details[0].message);
        }

        /* eslint-disable */
        for (const pre of preMiddlewares) {
          await pre(request, response);
        }
        /* eslint-enable */

        if (cache && method === "GET") {
          const cachedResult = MemoryCache.get(request.originalUrl);
          if (cachedResult) {
            return response
              .status(200)
              .set("X-Cached", true)
              .json(cachedResult);
          }
        }

        const result = await handler(request, response);

        if (result) {
          if (cache && method === "GET") {
            MemoryCache.set(
              request.originalUrl,
              result,
              cache === true ? 0 : parseInt(cache, 10)
            );
          }
          return response.status(200).json(result);
        }

        return response;
      } catch (error) {
        if (error.isError) {
          return response.status(error.status).json({ err: error.err });
        }

        return response.status(500).json({ error: error.message });
      }
    });
  });
}

export { createError, createServer, createHandler };
