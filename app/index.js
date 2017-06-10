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
		},
		created: function() {
			let vm = this;
			//登录状态检测
			vm.$store.commit('callLoading', true);
			wilddog.auth().onAuthStateChanged(function() {
				let currentUser = wilddogApp.auth().currentUser;
				vm.$store.commit('callLoading', false);
				if (currentUser) {
					vm.$store.commit('updateUserInfo', currentUser);
					vm.$store.dispatch('update');
					if (currentUser.email && !currentUser.emailVerified) {
						box.msg('邮箱未验证，请前往注册邮箱验证。没有到验证邮件？[<a href="javascript:;" class="btn btn-link resendvalidemail">点此重发</a>]', {
							color: 'info',
							onshow: function($box) {
								$box.find('.resendvalidemail').on('click', function() {
									vm.sendEmailVerified(function() {
										box.msg('验证邮件发送成功', {
											color: 'success'
										});
									});
								});
							}
						});
					}
					//同步云端数据
					let ref = wilddogApp.sync().ref();
					ref.child('/users/' + currentUser.uid).on('value', function(snapshot) {
						let userInfo = snapshot.val();
						if (userInfo.track.record && userInfo.track.record.split) {
							userInfo.track.record = JSON.parse(userInfo.track.record);
							vm.$store.commit('updateUserInfo', userInfo);
						} else {
							console.warn('用户数据异常', userInfo);
						}

					});
				} else {
					box.hide();
					return vm.$router.replace('/login');
				}
			});

		}
	});

});