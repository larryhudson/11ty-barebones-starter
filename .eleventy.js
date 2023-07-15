// const { generatePdf } = require("./utils/generate-pdf");
const { generateOgImages } = require("./utils/generate-og-images");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.on("eleventy.after", ({ results }) => {
    // generatePdf({
    //   pdfsToGenerate: [
    //     { inputUrl: "/pdf-input/", outputUrl: "/pdf.pdf" },
    //     {
    //       inputUrl: "/pdf-input-but-different/",
    //       outputUrl: "/pdf-different.pdf",
    //     },
    //   ],
    //   outputDir: "./11ty-output",
    //   serverPort: 8090,
    // });

    console.log(results);

    generateOgImages({
      srcJsonPath: "/og-images.json",
      outputDir: "./11ty-output",
      serverPort: 8090,
    });
  });

  return {
    dir: {
      input: "11ty-input",
      output: "11ty-output",
    },
  };
};
