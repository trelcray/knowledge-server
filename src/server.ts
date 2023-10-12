import { app } from "./app";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT ?? 8081;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
