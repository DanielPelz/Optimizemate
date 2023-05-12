// index.js
const fs = require('fs');
const path = require('path');

const ignoredFiles = ['index.js', 'user.js', 'check.js'];

function loadModules() {
    const modules = {};

    fs.readdirSync(__dirname).forEach((file) => {
        if (ignoredFiles.includes(file)) return;
        // Entfernt die Dateierweiterung ".js"
        const moduleName = file.slice(0, -3);
        modules[moduleName] = require(path.join(__dirname, file));
    });

    return modules;
}

module.exports = { loadModules };