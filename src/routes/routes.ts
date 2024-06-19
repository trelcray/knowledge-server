import { Router } from "express";

import {
  getAllUsers,
  createUser,
  getUserById,
  removeUser,
  unlockUser,
} from "../controller/user.controller";
import {
  createCategory,
  getCategories,
  getCategoriesById,
  editCategory,
  removeCategory,
  getTree,
} from "@/controller/category.controller";
import {
  createArticle,
  editArticle,
  removeArticle,
  getArticles,
  getArticleById,
  getArticlesByCategory,
} from "@/controller/article.controller";
import { signIn, validateToken } from "@/controller/auth.controller";
import { isAdmin } from "@/middlewares/admin";
import passport from "passport";
import { getStat } from "@/models/stat";

export const router = Router();

router.post("/sign-up", createUser);
router.post("/sign-in", signIn);
router.post("/validate-token", validateToken);

router.use(passport.authenticate("jwt", { session: false }));

router.post("/user", isAdmin, createUser);
router.get("/users", isAdmin, getAllUsers);
router.get("/user/:id", isAdmin, getUserById);
router.put("/user/:id", isAdmin, createUser);
router.delete("/user/:id", isAdmin, removeUser);
router.unlock("/user/:id", isAdmin, unlockUser);

router.get("/categories", isAdmin, getCategories);
router.post("/categories", isAdmin, createCategory);
router.get("/categories/tree", getTree);
router.put("/categories:id", isAdmin, editCategory);
router.get("/categories/:id", getCategoriesById);
router.delete("/categories/:id", isAdmin, removeCategory);

router.post("/articles", isAdmin, createArticle);
router.get("/articles", isAdmin, getArticles);
router.get("/articles/:id", getArticleById);
router.put("/articles/:id", isAdmin, editArticle);
router.delete("/articles/:id", isAdmin, removeArticle);

router.get("/categories/:id/articles", getArticlesByCategory);

router.get("/stats", getStat);
