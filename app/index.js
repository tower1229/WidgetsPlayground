/**
 * index
 */
define(function(require, exports, module) {
	"use strict";
	const util = require('js/util');
	const box = require('box');
	const components = require('js/component/global');

	const router = require('js/router');
	const store = require('js/store/store');
	const wilddogApp = require('js/wilddog');

	let app = new Vue({
		el: '#app',
		router,
		store,
		components,
		methods: {
			sendEmailVerified: function(cb) {
				let user = wilddogApp.auth().currentUser;
				if (user) {
					user.sendEmailVerification()
						.then(function() {
							console.log('验证邮件发送成功');
							if (typeof cb === 'function') {
								cb(user);
							}
						});
				}
			}
		}
	});

});