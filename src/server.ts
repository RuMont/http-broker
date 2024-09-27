import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import Controller from "./types/Controller";
import Container from "./injections/container";
import { Classname } from "./types/Classname";
import path from 'node:path';

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
    // Cors necesario para que los navegadores no bloqueen las peticiones
    this.express.use(cors());
    // Bodyparser necesario para poder leer jsons en peticiones
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
    // Para que nuestro servidor devuelva vistas necesitamos decirle donde están
    this.express.use(express.static(path.join(__dirname + '/views')));
    this.express.set('view engine', 'ejs');
    // Contenedor de inyección de dependencias
    Container.create();
  }

  public static createInstance(options: InitializeOpts) {
    if (!this.instance) this.instance = new Server(options);
    return this;
  }

  public static loadControllers(...controllers: Classname<Controller>[]) {
    controllers.forEach((controller) => {
      const controllerInstance = new controller();
      this.instance.express.use(controllerInstance.path, controllerInstance.setRoutes());
    });
    return this;
  }

  public static injectServices(...injectables: Classname<unknown>[]) {
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