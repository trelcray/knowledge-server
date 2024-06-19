import { db } from "@/lib/db";
import { Stat } from "@/models/stat";
import { scheduleJob } from "node-schedule";

export default function schedule() {
  scheduleJob("*/1 * * * *", async function () {
    const usersCount = await db("users")
      .whereNull("deletedAt")
      .count("id")
      .first();
    const categoriesCount = await db("categories").count("id").first();
    const articlesCount = await db("articles").count("id").first();

    const lastStat = await Stat.findOne({}, {}, { sort: { createdAt: -1 } });

    const stat = Stat.build({
      users: usersCount!.count as number,
      categories: categoriesCount!.count as number,
      articles: articlesCount!.count as number,
      createdAt: new Date(),
    });

    const changeUsers = !lastStat || stat.users !== lastStat.users;
    const changeCategories =
      !lastStat || stat.categories !== lastStat.categories;
    const changeArticles = !lastStat || stat.articles !== lastStat.articles;

    if (changeUsers || changeCategories || changeArticles) {
      await stat.save();
      console.log("[Stat] Statics updated");
    }
  });
}
