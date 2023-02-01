"use strict";
const express = require("express");
const { extract } = require("@extractus/oembed-extractor");
const { setProviderList } = require("@extractus/oembed-extractor");
// import fs from "fs";
const serverless = require("serverless-http");
const path = require("path");
const https = require("https");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

require("encoding");

const app = express();
const router = express.Router();
// const options = {
//   key: fs.readFileSync("/Users/lukew/localhost.key"),
//   cert: fs.readFileSync("/Users/lukew/localhost.cert"),
//   requestCert: false,
//   rejectUnauthorized: false,
// };

// const port = 80;
// app.use(express.static("public"));

const providers = [
  {
    provider_name: "Netlify",
    provider_url: "https://cerulean-malabi-2996d0.netlify.app",
    endpoints: [
      {
        url: "https://cerulean-malabi-2996d0.netlify.app/.netlify/functions/server/oembed",
      },
    ],
  },
];

setProviderList(providers);

router.get("/viewoembed", async (req, res) => {
  const result = await extract("https://cerulean-malabi-2996d0.netlify.app");
  res.send(result);
});

router.get("/oembed", async (req, res) => {
  let manifestURL = req.query.url;
  // let manifestURL =
  // "https://collections.snm.ku.dk/en/api/iiif/object/NHMD616060/manifest";
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

// https.createServer(options, app).listen(443);
app.use("/.netlify/functions/server", router);
app.use("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../dist/index.html"))
);

module.exports = app;
module.exports.handler = serverless(app);
