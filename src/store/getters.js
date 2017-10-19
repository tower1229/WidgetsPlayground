define(function(require, exports, module) {
	"use strict";
	const util = require('js/assets/util');

	module.exports = {
		navData: function(state) {
			let allwidgetsnum = 0;
			let homeIndex;
			let navData = JSON.parse(JSON.stringify(state.widgets));
			if (Array.isArray(navData) && navData.length) {
				navData.forEach(function(cell, i) {
					let channelwidgetsnum = 0;
					if (Array.isArray(cell.list) && cell.list.length) {
						cell.list.forEach(function(e) {
							if (e.list) {
								channelwidgetsnum += e.list.length;
							}
						});
					}
					cell.nums = channelwidgetsnum;
					allwidgetsnum += channelwidgetsnum;
					if (cell.title === '首页') {
						homeIndex = i;
					}
				});
				navData[homeIndex].nums = allwidgetsnum;
			}
			return navData;
		},
		flatData: function(state) {
			return util.flatData(state.widgets);
		},
		showingWidgets: function(state, getters) {
			let result = [];
			if (state.keywords) {
				result = getters.filterSearch;
			} else {
				result = getters.filterChannel;
			}
			//标签筛选
			if (state.filtertag.length) {
				let newresult = [];
				let copyfiltertag = state.filtertag;
				result.forEach(function(wid, i) {
					let mytag = wid.tag.split('/');
					copyfiltertag.forEach(function(tag, o) {
						if (util.arrIncludes(mytag, tag)) {
							newresult.push(wid);
						}
					});
				});
				result = newresult;
			} else {
				let mytags = new Set();
				result.forEach(function(e, i) {
					if (e.tag) {
						let thisTag = e.tag.split('/');
						thisTag.forEach(function(tag) {
							if (tag.trim()) {
								mytags.add(tag.trim());
							}
						});
					}
				});
				state.tags = Array.from(mytags);
			}

			return result;
		},
		filterChannel: function(state, getters) {
			let result = [];
			if (state.widgets.length) {
				let n_0 = parseInt(state.currentNav[0]);
				let n_1 = parseInt(state.currentNav[1]);
				if (!n_0 || isNaN(n_0)) {
					result = getters.flatData;
					state.bread = state.widgets[0].title;
				} else if(n_1 === void(0) || isNaN(n_1)){
					result = util.flatData(state.widgets[n_0].list);
					state.bread = state.widgets[n_0].title;
				} else {
					result = state.widgets[n_0].list.length ? state.widgets[n_0].list[n_1].list : [];
					state.bread = state.widgets[n_0].title + ' / ' + (state.widgets[n_0].list[n_1] ? state.widgets[n_0].list[n_1].title : '');
				}
				state.showingWidgets = result;
			}
			return result;
		},
		filterSearch: function(state, getters) {
			//搜索
			let result = getters.flatData;
			if (result.length && state.keywords) {
				let key = state.keywords;
				let search = new Set();
				let nums = result.length;
				//title完全匹配
				result.forEach(function(e, i) {
					if (e.title === key) {
						search.add(e);
					}
				});
				//widget完全匹配
				result.forEach(function(e, i) {
					if (e.widget === key) {
						search.add(e);
					}
				});
				//title包含匹配
				result.forEach(function(e, i) {
					if (e.title.indexOf(key) > -1) {
						search.add(e);
					}
				});
				//widget包含匹配
				result.forEach(function(e, i) {
					if (e.widget.indexOf(key) > -1) {
						search.add(e);
					}
				});
				//tag匹配
				result.forEach(function(e, i) {
					if (e.tag.indexOf(key) > -1) {
						search.add(e);
					}
				});
				//author匹配
				result.forEach(function(e, i) {
					if (e.author.indexOf(key) > -1) {
						search.add(e);
					}
				});
				result = Array.from(search);
				state.showingWidgets = result;
				return result;
			} else {
				state.showingWidgets = state.filterChannel;
			}
			return [];
		}
	};
});