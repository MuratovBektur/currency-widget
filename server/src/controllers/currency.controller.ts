import express from "express";

import currencyModel from "../models/currency.model";

class RecordController {
  async getAll(req: express.Request, res: express.Response) {
    const data = JSON.parse(await currencyModel.getAll())
    if (!data.success) {
      return res.status(500).json(data);
    }
    return res.json(data);

  }
  async getById(req: express.Request, res: express.Response) {
    const id: string = req.params.id;

    const data = JSON.parse(await currencyModel.getById(id));
    if (!data.success) {
      if (data.reason?.message === "Can't found record with received id") {
        return res.status(400).json(data);
      }
      return res.status(500).json(data);
    }
    return res.json(data);
  }


}

export default new RecordController();
