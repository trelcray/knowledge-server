import { Request, Response } from "express";
import { existsOrError } from "@/utils/validations";
import { db } from "@/lib/db";
import { categoryWithChildren } from "@/lib/queries";

export const createArticle = (req: Request, res: Response) => {
  const article = { ...req.body };

  try {
    existsOrError(article.name, "Name not given");
    existsOrError(article.description, "Description not given");
    existsOrError(article.categoryId, "Category not given");
    existsOrError(article.userId, "Author not given");
    existsOrError(article.content, "Content not given");
  } catch (msg) {
    return res.status(400).send(msg);
  }

  db("articles")
    .insert(article)
    .then(() => res.status(201).send())
    .catch((err) => res.status(500).send(err));
};

export const editArticle = (req: Request, res: Response) => {
  const article = { ...req.body };

  try {
    existsOrError(article.name, "Name not given");
    existsOrError(article.description, "Description not given");
    existsOrError(article.categoryId, "Category not given");
    existsOrError(article.userId, "Author not given");
    existsOrError(article.content, "Content not given");
  } catch (msg) {
    return res.status(400).send(msg);
  }

  db("articles")
    .update(article)
    .where({ id: article.id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const removeArticle = async (req: Request, res: Response) => {
  try {
    existsOrError(req.params.id, "Article code not given.");

    const rowsDeleted = await db("articles").where({ id: req.params.id }).del();
    try {
      existsOrError(rowsDeleted, "Article not found.");
    } catch (msg) {
      return res.status(400).send(msg);
    }

    res.status(204).send();
  } catch (msg) {
    res.status(500).send(msg);
  }
};

export const getArticles = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const limit = 10;
  const page = parseInt(req.query.page as string) || 1;

  const result = await db("articles").count("id").first();
  const count = parseInt(result?.count as string);

  await db("articles")
    .select("id", "name", "description")
    .limit(limit)
    .offset(page * limit - limit)
    .then((articles) => res.json({ data: articles, count, limit }))
    .catch((err) => res.status(500).send(err));
};

export const getArticleById = (req: Request, res: Response) => {
  db("articles")
    .where({ id: req.query.id })
    .first()
    .then((article) => {
      article.content = article.content.toString();
      return res.json({ data: article });
    })
    .catch((err) => res.status(500).send(err));
};

export const getArticlesByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const categories = await db.raw(categoryWithChildren, categoryId);
  const ids = categories.rows.map((c: { id: string }) => c.id);

  db({ a: "articles", u: "users" })
    .select("a.id", "a.name", "a.description", "a.imageUrl", {
      author: "u.name",
    })
    .limit(limit)
    .offset(page * limit - limit)
    .whereRaw("?? = ??", ["u.id", "a.userId"])
    .whereIn("categoryId", ids)
    .orderBy("a.id", "desc")
    .then((articles) => res.json(articles))
    .catch((err) => res.status(500).send(err));
};
