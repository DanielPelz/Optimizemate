function getPageDescription($) {
    const descriptionTag = $("meta[name='description']");
    return descriptionTag.attr("content") || "";
}

module.exports = {
    getPageDescription
}