cd ../;
tsc  --noEmit > ./inspect/error.log;
cd ./inspect;
node filter.js
