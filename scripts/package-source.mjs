import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const archive=path.join(root,'public','source.tgz');
execFileSync('tar',['-czf',archive,'--exclude=./node_modules','--exclude=./dist','--exclude=./.git','--exclude=./.openai','--exclude=./.cache','--exclude=./public/source.tgz','--exclude=*.tsbuildinfo','.'],{cwd:root,stdio:'inherit'});
console.log('已生成可从网页下载的开源代码：public/source.tgz');
