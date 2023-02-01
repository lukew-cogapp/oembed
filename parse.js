import express from "express";
import { extract } from "@extractus/oembed-extractor";

const app = express();
const port = 3000;

const result = await extract("https://www.youtube.com/watch?v=x2bqscVkGxk");
// console.log(result);

app.get("/", (req, res) => {
  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
