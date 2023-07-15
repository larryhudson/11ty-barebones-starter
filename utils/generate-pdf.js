// for rendering HTML and taking screenshots
const puppeteer = require("puppeteer");
const nodeStaticServer = require("node-static");
const http = require("http");
const path = require("path");

async function generatePdf({ outputDir, serverPort, pdfsToGenerate }) {
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

  for (const pdfPage of pdfsToGenerate) {
    await browserPage.goto(`http://localhost:${serverPort}${pdfPage.inputUrl}`);
    console.log("writing pdf", pdfPage.outputUrl.slice(1));
    await browserPage.pdf({
      path: path.join(outputDir, pdfPage.outputUrl.slice(1)),
    });
  }

  // when we are done, shut down the browser, the static server and close the image stream
  browser.close();
  eleventyServer.close();
}

module.exports = {
  generatePdf,
};
