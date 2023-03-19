function getPageKeywords($) {
    const keywordsTag = $("meta[name='keywords']");
    return (keywordsTag.attr("content") || "").split(",").map(keyword => keyword.trim());
}

module.exports = {
    getPageKeywords
}