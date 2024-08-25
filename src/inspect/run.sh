cd ../../; # 去代码目录
NODE_OPTIONS=--max-old-space-size=8192 tsc --noEmit > ./inspect/symtax/error.log; # 打印日志文件。tsc 需要大内存，否则失败
cd ./inspect/symtax; # 回到此目录
bun filter.ts # 过滤日志文件
