import express from "express";
import { extract } from "@extractus/oembed-extractor";
import { setProviderList } from "@extractus/oembed-extractor";
import fs from "fs";

import https from "https";

const app = express();
const options = {
  key: fs.readFileSync("/Users/lukew/localhost.key"),
  cert: fs.readFileSync("/Users/lukew/localhost.cert"),
  requestCert: false,
  rejectUnauthorized: false,
};

// const port = 80;
app.use(express.static("public"));

const providers = [
  {
    provider_name: "Localhost",
    provider_url: "http://localhost",
    endpoints: [{ url: "http://localhost/oembed" }],
  },
];

setProviderList(providers);

app.get("/", async (req, res) => {
  const result = await extract("http://localhost/page.html");
  res.send(result);
});

app.get("/oembed", async (req, res) => {
  let manifestURL = req.query.url;
  try {
    const response = await fetch(manifestURL);
    const json = await response.json();
    const oEmbedJSON = `
    {
      "web_page": "https://www.google.co.uk",
      "width": 500,
      "height": 400,
      "title": "${json.label.en[0]}",
      "html": "<p>This should be a mirador iframe</p>"
    }
    `;
    res.send(JSON.parse(oEmbedJSON));
  } catch (err) {
    console.log(err);
  }
  // res.send(json);
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

https.createServer(options, app).listen(443);
