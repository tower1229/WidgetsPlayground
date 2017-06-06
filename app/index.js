/**
 * index
 */
define(function(require, exports, module) {
	"use strict";
	const util = require('js/util');
	const box = require('box');

	const component = require('js/component/component');
	
	const router = require('js/router');
	const store = require('js/store/store');

	let app = new Vue({
		el: '#app',
		router,
		store,
		created: function() {
			let vm = this;
			store.commit('callLoading', true);
			let userInfo = util.storage.get('userInfo');
			if (userInfo) {
				store.commit('setUserInfo', userInfo);
			} else {
				util.storage.set('userInfo', store.state.userInfo);
			}
			axios.get(seajs.widgetRootPath + "/data.json").then(response => {
				let res = response.data;
				store.commit('setWidgets', res.widgets);
				if (res.version) {
					if (util.storage.get('version') && (util.storage.get('version').value !== res.version.value)) {
						box.alert(res.version.description, function() {
							store.dispatch('update');
						}, {
							title: "即将升级到" + res.version.value,
							oktext: "立即升级",
							bgclose: false,
							btnclose: false
						});
					} else {
						store.commit('setVersion', res.version);
						util.storage.set('version', res.version);
					}
				}
				store.commit('callLoading', false);
			});
		}
	});

});