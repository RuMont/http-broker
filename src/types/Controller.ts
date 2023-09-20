import { Router, Response } from "express";
import { Route } from "./Route";

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Route[];

  public setRoutes = (): Router => {
    for (const route of this.routes) {
      try {
        for (const middleware of (route.localMiddleware ?? [])) {
          this.router[route.method](route.path, middleware);
        }

        this.router[route.method](route.path, route.handler.bind(this));
      } catch (err) {
        throw `Error in src/types/Controller.ts: ${err}`;
      }
    }
    return this.router;
  }

  protected sendSuccess(
    res: Response,
    data: NonNullable<{}>,
    message?: string,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      message: message || 'success',
      data: data,
    });
  }

  protected sendError(
    res: Response,
    message?: string
  ): Response {
    return res.status(500).json({
      message: message || 'internal server error'
    })
  }
}