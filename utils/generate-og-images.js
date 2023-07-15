// for rendering HTML and taking screenshots
const puppeteer = require("puppeteer");
const nodeStaticServer = require("node-static");
const http = require("http");
const path = require("path");
const fs = require("node:fs");

async function generateOgImages({ srcJsonPath, outputDir, serverPort }) {
  // create a static web server, so puppeteer can view the website
  const fileServer = new nodeStaticServer.Server(outputDir);

  const eleventyServer = http.createServer(function (request, response) {
    request
      .addListener("end", function () {
        fileServer.serve(request, response);
      })
      .resume();
  });

  eleventyServer.listen(serverPort);

  // boot up the puppeteer browser

  const browser = await puppeteer.launch();
  const browserPage = await browser.newPage();

  const ogImageUrls = await fs.promises
    .readFile(path.join(outputDir, srcJsonPath))
    .then(JSON.parse);

  for (const ogImageUrl of ogImageUrls) {
    await browserPage.goto(`http://localhost:${serverPort}${ogImageUrl}`);
    console.log("writing screenshot", ogImageUrl.slice(1));
    await browserPage.screenshot({
      type: "jpeg",
      quality: 100,
      path: path.join(outputDir, ogImageUrl.slice(1, -1) + ".jpg"),
    });
  }

  // when we are done, shut down the browser, the static server and close the image stream
  browser.close();
  eleventyServer.close();
}

module.exports = {
  generateOgImages,
};
