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
			let Main = document.getElementById("main");
			let Target = document.getElementById("welcome");
			if(Main && Target){
				Main.scrollTop = Target.offsetHeight;
			}else{
				console.warn('scrollTop: error');				
			}
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
		updateUserInfo: function(state, info) {
			Object.keys(state.userInfo).forEach(function(e,i){
				state.userInfo[e] = info[e] || state.userInfo[e];
			});
		},
		setWidgets: function(state, widgets) {
			state.widgets = widgets;
		},
		setVersion: function(state, version) {
			state.version = version;
			util.storage.set('version', version);
		}
	};
});