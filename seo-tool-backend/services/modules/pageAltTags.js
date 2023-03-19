function getImageAltTags($) {
    const images = $("img");
    const imageCount = images.length;
    const missingAltTags = [];
    images.each((index, image) => {
        const alt = $(image).attr("alt");
        if (!alt) {
            missingAltTags.push(index + 1);
        }
    });
    return {
        imageCount,
        missingAltTags
    };
}

module.exports = {
    getImageAltTags
}