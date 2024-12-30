cd ../; # 去总目录，读取 tsconfig.json 和 node_modules/typescript
NODE_OPTIONS=--max-old-space-size=8192 tsc --noEmit > ./inspect/error.log; # 打印日志文件。tsc 需要大内存，否则失败
cd ./inspect; # 回到此目录
bun filter.ts # 用 bun 执行过滤器，对日志文件分类
