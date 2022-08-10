#!/usr/bin/env sh
rm -f scripts/*.js
rm -f esbuild.js
npx esbuild scripts/visitTest.ts --outfile=scripts/visitTest.js --format=cjs
npx esbuild scripts/generateAST.ts --outfile=scripts/generateAST.js --format=cjs
npx esbuild scripts/bin.ts --outfile=scripts/bin.js --format=cjs
npx esbuild scripts/delete.ts --outfile=scripts/delete.js --format=cjs
npx esbuild esbuild.ts --outfile=esbuild.js --format=cjs