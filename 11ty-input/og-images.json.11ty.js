class OgImageJson {
  data() {
    return {
      permalink: "/og-images.json",
    };
  }

  render(data) {
    const ogImages = data.collections["og-image"];
    // console.log(ogImages);
    return "test";
    return JSON.stringify(
      ogImages.map((ogImage) => ogImage.page.url),
      null,
      2
    );
  }
}

module.exports = OgImageJson;
