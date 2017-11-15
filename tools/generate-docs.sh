#/bin/sh
cd /home/marcelherd/SEP-Gryffindor
git checkout develop
git pull origin develop
cd /home/marcelherd/SEP-Gryffindor/Bot-Runtime
npm install
npm run jsdoc
cd /home/marcelherd/SEP-Gryffindor/Bot-Config
npm install
npm run jsdoc
