const fs = require('fs');
const path = require('path');

function filename(fullpath) {
    return path.basename(fullpath).slice(0, -path.extname(fullpath).length);
}

const newComponentName = process.argv[2];
let funcOrClass = process.argv[3];

if (newComponentName.length === 0) {
    console.error("Component name cannot be blank");
    return;
}
if (!funcOrClass) {
    funcOrClass = 'class';
}
else {
    if (funcOrClass === '-f') {
        funcOrClass = 'function'
    }
    else if (funcOrClass === '-c') {
        funcOrClass = 'class';
    }
    else {
        console.log('Invalid value for funcOrClass');
    }
}

try {
    const dirContents = fs.readdirSync('./src/components');
    const matchingComponentName = dirContents.find(((existingComponent) => { 
        return newComponentName === filename(existingComponent);
    }));

    if (matchingComponentName) {
        console.log(`Can't create component ${newComponentName}, it already exists.`);
        return;
    }
    console.log(`Gunna create component: ${newComponentName}`);

    // Create component
    let fileContents = "";
    const sourceFile = funcOrClass === 'function' ? './scripts/reactComponentFunctionTemplate.jsx' : './scripts/reactComponentClassTemplate.jsx';
    fileContents = fs.readFileSync(sourceFile).toString().replace('COMPONENT', newComponentName);
    fs.writeFileSync(`./src/components/${newComponentName}.jsx`, fileContents);

} catch (error) {
    console.log(error);
    return;
}
