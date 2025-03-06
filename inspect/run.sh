cd ../; # 去代码目录
NODE_OPTIONS=--max-old-space-size=8192 tsc --noEmit > ./inspect/dist/error-ts.log; # 打印日志文件。tsc 需要大内存，否则失败
# yarn run eslint . --ext .ts,.tsx --quiet >> ./inspect/dist/error-eslint.log; # 找严重的 ESLint 错误
cd ./inspect; # 回到此目录
bun filter/index.ts # 过滤日志文件
npm run dev
