import { Request, Response } from "express";
import { query } from "../models/db";

class FiltroController {
  public async Estados(_: Request, res: Response): Promise<void> {
    const r: any = await query("SELECT estadonome FROM estado ORDER BY estadonome");
    res.json(r);
  }

  public async Biomas(_: Request, res: Response): Promise<void> {
    const r: any = await query("SELECT biomanome FROM bioma ORDER BY biomanome");
    res.json(r);
  }
}
export default new FiltroController();
