import { Request, Response } from "express";
import { Schema, model, Document, Model } from "mongoose";

interface IStatAttrs {
  users: number;
  categories: number;
  articles: number;
  createdAt: Date;
}

interface IStatDoc extends Document {
  users: number;
  categories: number;
  articles: number;
  createdAt: Date;
}

interface IStatModel extends Model<IStatDoc> {
  build(attrs: IStatAttrs): IStatDoc;
}

const statSchema = new Schema({
  users: Number,
  categories: Number,
  articles: Number,
  createdAt: Date,
});

statSchema.statics.build = (attrs: IStatAttrs) => {
  return new Stat(attrs);
};

const Stat = model<IStatDoc, IStatModel>("Stat", statSchema);

const getStat = (req: Request, res: Response) => {
  Stat.findOne({}, {}, { sort: { createdAt: -1 } }).then((stat) => {
    const defaultStat = {
      users: 0,
      categories: 0,
      articles: 0,
    };
    res.json(stat ?? defaultStat);
  });
};

export { Stat, getStat };
