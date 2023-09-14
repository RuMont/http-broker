import { NextFunction, Request, Response } from "express";
import Controller from "../types/Controller";
import { Route } from "../types/Route";
import MessageService from "../services/MessageService";
import Container from "../injections/container";

export default class MessageController extends Controller {
  public path: string = '/';
  protected routes: Route[] = [
    {
      path: '/status',
      method: 'get',
      handler: this.getStatus,
    },
    {
      path: '/subscribe',
      method: 'get',
      handler: this.subscribe
    },
    {
      path: '/publish',
      method: 'post',
      handler: this.publish
    }
  ];

  constructor() {
    super();
  }

  public getStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.json(Container.get<MessageService>('MessageService').status());
  }

  public subscribe(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    Container.get<MessageService>('MessageService').subscribe(req, res);
  }

  public publish(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const sentMessage = Container.get<MessageService>('MessageService').publish(req);
    res.json(sentMessage);
  }
}