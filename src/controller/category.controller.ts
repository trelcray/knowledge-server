import { db } from "@/lib/db";
import { existsOrError, notExistsOrError } from "@/utils/validations";
import { ICategoriesProps, withPath } from "@/utils/withPathOrdered";
import { Request, Response } from "express";

export const createCategory = (req: Request, res: Response) => {
  const category = { ...req.body };

  try {
    existsOrError(category.name, "Name not given");
  } catch (msg) {
    return res.status(400).send(msg);
  }

  db("categories")
    .insert(category)
    .then(() => res.status(201).send())
    .catch((err) => res.status(500).send(err));
};

export const editCategory = (req: Request, res: Response) => {
  const category = { ...req.body };

  try {
    existsOrError(category.name, "Name not given");
  } catch (msg) {
    return res.status(400).send(msg);
  }

  db("categories")
    .update(category)
    .where({ id: category.id })
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    existsOrError(req.params.id, "Category code not given.");

    const subcategory: string[] = await db("categories").where({
      id: req.params.id,
    });

    notExistsOrError(subcategory, "Category have subcategory.");

    const articles = await db("articles").where({ id: req.params.id });
    notExistsOrError(articles, "Category have articles.");

    const rowsDeleted = await db("categores")
      .where({ id: req.params.id })
      .del();
    existsOrError(rowsDeleted, "Category not given.");

    res.status(204).send();
  } catch (msg) {
    res.status(400).send(msg);
  }
};

export const getCategories = (req: Request, res: Response) => {
  db("categories")
    .then((caregories) => res.json(withPath(caregories)))
    .catch((err) => res.status(500).send(err));
};

export const getCategoriesById = (req: Request, res: Response) => {
  const { id } = req.params;
  db("categories")
    .where({ id })
    .first()
    .then((category) => res.json(category))
    .catch((err) => res.status(500).send(err));
};

const toTree = (categories: ICategoriesProps[], tree?: ICategoriesProps[]) => {
  if (!tree) tree = categories.filter((c) => !c.parentId);
  tree = tree.map((parentNode) => {
    const isChild = (node: ICategoriesProps) => node.parentId === parentNode.id;
    parentNode.children = toTree(categories, categories.filter(isChild));
    return parentNode;
  });
  return tree;
};

export const getTree = (req: Request, res: Response) => {
  db("categories")
    .then((categories) => res.json(toTree(withPath(categories))))
    .catch((err) => res.status(500).send(err));
};
