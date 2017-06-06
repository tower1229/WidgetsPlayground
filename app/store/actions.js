define(function(require, exports, module) {
	"use strict";
	const util = require('js/util');

	module.exports = {
		update: function(context) {
			context.commit('callLoading', true);
			axios.get(seajs.widgetRootPath + "/data.json", {
				emulateJSON: true
			}).then(response => {
				const res = response.data;
				context.commit('setVersion', res.version);
				context.commit('setWidgets', res.widgets);
				context.commit('callLoading', false);
			});
			util.storage.clear();
		},
		widgetClick: function(context, widgetObject) {
			if (context.state.waitToChoose) {
				context.commit('setWaitToChoose', false);
				context.commit('setChoosen', widgetObject);
			} else {
				let _playingWidgets = context.state.playingWidgets;
				_playingWidgets.push(widgetObject);
				context.commit('setPlaying', _playingWidgets);
			}
		}
	};
});