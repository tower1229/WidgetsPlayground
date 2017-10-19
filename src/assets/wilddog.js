define(function(require, exports, module) {
	"use strict";
	const app = wilddog.initializeApp({
		syncURL: "https://wild-boar-02388.wilddogio.com",
		authDomain: "wild-boar-02388.wilddog.com"
	});
	module.exports = app;
});