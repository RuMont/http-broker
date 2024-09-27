import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";

export default class MainController extends Controller {
  public path: string = "/";
  protected routes: Route[] = [
    {
      path: "/",
      method: "get",
      handler: this.index,
    },
  ];

  constructor() {
    super();
  }

  public index(req: Request, res: Response, next: NextFunction) {
    res.render('/index.html');
  }
}
