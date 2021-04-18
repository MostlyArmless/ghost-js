const fse = require( "fs-extra" );
// Because React's `npm start` changes the tsconfig to use esnext modules and the mocha test explorer vs code extension requires commonjs modules, you'll need to run this script
// after having run `npm start` in order to be able to use the test explorer. You can't use/run both simultaneously.

console.log(
    `Setting tsconfig compilerOptions.module to "commonjs" for Mocha Test Explorer to work...`
);
const tsconfigFile = "./tsconfig.json";
let tsconfigContents = fse.readJSONSync( tsconfigFile );

tsconfigContents.compilerOptions.module = "commonjs";

fse.writeJsonSync( tsconfigFile, tsconfigContents, { spaces: 2 } );

console.log( "Done" );
