import { Response } from "express";

export type Client = {
  id: string;
  response: Response;
}