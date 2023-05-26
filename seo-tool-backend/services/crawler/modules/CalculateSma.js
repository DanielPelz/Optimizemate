function calculateSma(array, n) {
    if (array.length < n) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    } else {
        const lastNElements = array.slice(-n);
        return lastNElements.reduce((a, b) => a + b, 0) / n;
    }
}

module.exports = calculateSma;