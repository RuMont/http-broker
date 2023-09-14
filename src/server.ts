import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import Controller from "./types/Controller";
import Container, { Injection } from "./injections/container";

type InitializeOpts = {
  port: number
}

export default class Server {
  private readonly express: express.Express;
  private static instance: Server;
  private readonly port: number;

  private constructor({ port }: InitializeOpts) {
    this.port = port;
    this.express = express();
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}))
  }

  public static createInstance(options: InitializeOpts) {
    if (!this.instance) this.instance = new Server(options);
    return this;
  }

  public static loadControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.instance.express.use(controller.path, controller.setRoutes());
    });
    return this;
  }

  public static injectServices(injectables: object[]) {
    Container.create();
    injectables.forEach(injectable => Container.add(injectable));
    return this;
  }
  
  public static listen() {
    if (!this.instance) throw Error('call Server.createInstance first');
    this.instance.express.listen(this.instance.port, () =>
      console.log(`Running on http://localhost:${this.instance.port}`)
    );
  }

}