bin/index.js: $(wildcard src/*.js) .babelrc
	yarn build
