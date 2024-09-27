import { Request, Response } from "express";
import { Client } from "../types/Client";
import { randomUUID } from "crypto";

export default class MessageService {
  private clients: Client[] = [];
  private messages: NonNullable<{}>[] = [];

  public status() {
    return { clients: this.clients.length };
  }

  public subscribe(req: Request, res: Response) {
    const id = randomUUID();
    this.registerClient(res, id);
    this.watchConnection(req, res, id);
  }

  public publish(req: Request) {
    const message = req.body;
    this.messages.push(message);
    this.notifySubscribers(message);
    return message;
  }

  private registerClient(res: Response, id: Client['id']) {
    this.clients.push({
      id,
      response: res
    });
    console.log(`${id} Connection open`);
  }

  private watchConnection(req: Request, res: Response, id: Client['id']) {
    res.write('');
    req.on('close', () => this.unregisterClient(id));
  }

  private unregisterClient(id: Client['id']) {
    console.log(`${id} Connection closed`);
    this.clients = this.clients.filter(client => client.id !== id);
  }

  private notifySubscribers(message: NonNullable<{}>) {
    this.clients.forEach(client => client.response.write(`data: ${JSON.stringify(message)}\n\n`))
  }
}