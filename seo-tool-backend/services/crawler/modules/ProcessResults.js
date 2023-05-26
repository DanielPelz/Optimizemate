async function processResults(tasks, results) {
    const pageData = {};
    tasks.map((task, i) => {
        const result = results[i];
        const keys = task.key.split('.');
        if (keys[0] === 'metrics') {
            if (!pageData.metrics) pageData.metrics = {};
            pageData.metrics[keys[1]] = result.status === "fulfilled" ? result.value : `Error: ${result.reason}`;
        } else {
            pageData[keys[0]] = result.status === "fulfilled" ? result.value : `Error: ${result.reason}`;
        }
    });
    return pageData;
}


module.exports = processResults;