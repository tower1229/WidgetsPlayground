/**
 * index
 */
define(function(require, exports, module) {
	"use strict";
	const router = require('js/router');
	const store = require('js/store/store');
	const wilddogApp = require('js/assets/wilddog');

	let app = new Vue({
		el: '#app',
		router,
		store,
		components: {
			"loading": {
				template: `<div v-if="show" class="globalMask">
	<div class="bubblingG">
		<span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span>
	</div>
</div>`,
				computed: {
					show: function() {
						return this.$store.state.showLoading;
					}
				}
			}
		},
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