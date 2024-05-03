import Joi from "joi";
import NodeCache from "node-cache";
const MemoryCache = new NodeCache();

const allRoutes = [];

function createError(status, err, extra) {
  return {
    isError: true,
    status,
    err,
    extra,
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

    const preMiddlewares = [...globalPreMiddlewars];

    const prefix = config.prefix || "";
    const normalisedPath = `/${prefix}/${path}`.replace(/\/+/g, "/");

    allRoutes.push({
      fullPath: normalisedPath,
      path,
      handler,
      method,
      schema,
      cache,
    });

    if (schema && schema.request) {
      preMiddlewares.push((request, response, next) => {
        
        const { error } = schema.request.validate(request, {
          allowUnknown: true,
        });
        if (error) {
          const message = error instanceof Error ? error.message :  error.details[0].message;
          return response.status(400).json({ error: message });
        }
        next();
      });
    }

    preMiddlewares.push(...pre);

    app[method.toLowerCase()](
      normalisedPath,
      [...preMiddlewares],
      async (request, response) => {
        try {
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
            return response.status(error.status).json({ error: error.err, ...error.extra });
          }

          return response.status(500).json({ error: error.message });
        }
      }
    );
  });
}

function getRoutes() {
  return allRoutes;
}

export { createError, createServer, createHandler, getRoutes };
