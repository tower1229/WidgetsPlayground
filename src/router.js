define(function(require, exports, module) {
	"use strict";

	const router = new VueRouter({
		base: seajs.root,
		routes: [{
			path: '/',
			component: function (resolve, reject) {
				require.async('js/component/main', function(main){
					resolve(main);
				});
			},
			children: [{
				path: '/channel/:cid',
				children: [{
					path: 'type/:tid'
				}]
			}]
		}, {
			path: '/login',
			component: function (resolve, reject) {
				require.async('js/component/login', function(login){
					resolve(login);
				});
			}
		}, {
			path: '/regist',
			component: function (resolve, reject) {
				require.async('js/component/regist', function(regist){
					resolve(regist);
				});
			}
		}, {
			path: '*',
			redirect: '/'
		}]
	});
	
	module.exports = router;
});