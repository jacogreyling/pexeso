'use strict';

const Fs = require('fs');

const wipeDependencies = function () {

    const file = Fs.readFileSync('package.json');
    const content = JSON.parse(file);

    for (const devDep in content.devDependencies) {
        content.devDependencies[devDep] = '*';
    }

    for (const dep in content.dependencies) {
        content.dependencies[dep] = '*';
    }

    Fs.writeFileSync('package.json', JSON.stringify(content));
};

if (require.main === module) {
    wipeDependencies();
}
else {
    module.exports = wipeDependencies;
}
