import path from "path";

let rootPath = process.cwd();
let clientPath = path.join(rootPath, 'src');
let distPath = path.join(rootPath, '.dist');

let paths = {
  root: rootPath,
  client: clientPath,
  dist: distPath,
  assets: path.join(rootPath, 'assets/**/*'),
  scssEntry: path.join(clientPath, 'index.scss'),
  scssBatch: path.join(clientPath, '/**/*.scss'),
  jsEntry: path.join(clientPath, 'index.js'),
  htmlEntry: path.join(clientPath, 'index.html')
};

export {
  paths
}
