#!/usr/bin/env sh
set -e
npm run build
cd assets
git init
git add .
git commit -m 'Update Github Gages'
git push -f git@github.com:nusr/compiler.git master:gh-pages
cd -
exit