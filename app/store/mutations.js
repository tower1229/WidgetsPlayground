define(function(require, exports, module) {
	"use strict";
	const util = require('js/util');

	module.exports = {
		setChoosen: function(state, choosenWidget) {
			state.choosenWidget = choosenWidget;
		},
		setWaitToChoose: function(state, bool) {
			state.waitToChoose = !!bool;
		},
		setPlaying: function(state, playingWidgets) {
			state.playingWidgets = playingWidgets;
		},
		callLoading: function(state, bool) {
			state.showLoading = !!bool;
		},
		search: function(state, value) {
			state.keywords = value.trim();
		},
		scrollTop: function() {
			document.getElementById("main").scrollTop = document.getElementById("welcome").offsetHeight;
		},
		updateNav: function(state, currentNav) {
			if (Array.isArray(currentNav)) {
				state.currentNav = currentNav;
			}
			state.keywords = '';
		},
		filterTag: function(state, tags) {
			state.filtertag = tags;
		},
		sort: function(state, by) {
			state.sortBy = by;
		},
		setCallCode: function(state, callCode) {
			state.callCode = callCode;
		},
		callWidget: function(state) {
			if (state.callCode.trim() && state.callCode.match(/^\[(.+:.+,*){1,}\]$/)) {
				let vm = this;
				let newWidget = JSON.parse(state.callCode);
				let flatData = util.flatData(state.widgets);
				let result = [];
				newWidget.forEach(function(e) {
					let clean = flatData.find(function(value) {
						return e.widget === value.widget;
					});
					if (e.userConfig) {
						clean.userConfig = e.userConfig;
					}
					result.push(clean);
				});
				state.playingWidgets = result;
			} else {
				state.callCode = '';
			}
		},
		setUserInfo: function(state, info) {
			Object.assign(state.userInfo, info);
			util.storage.set('userInfo', state.userInfo);
		},
		setWidgets: function(state, widgets) {
			state.widgets = widgets;
			util.storage.set('widgets', widgets);
		},
		setVersion: function(state, version) {
			state.version = version;
		}
	};
});