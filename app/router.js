define(function(require, exports, module) {
	"use strict";
	const component = require('js/component/component');

	const router = new VueRouter({
		base: seajs.root,
		routes: [{
			path: '/'
		}, {
			path: '/channel/:cid',
			children: [{
				path: 'type/:tid'
			}]
		}, {
			path: '*',
			redirect: '/'
		}],
		scrollBehavior(to, from, savedPosition) {
			if (savedPosition) {
				return savedPosition;
			} else {
				return {
					x: 0,
					y: 0
				};
			}
		}
	});
	//TODO: url参数
	module.exports = router;
});