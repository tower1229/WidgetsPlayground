/**
 * name: util
 * version: v1.0.1
 * update: 潜在的日期排序bug
 * date: 2015-07-03
 */
define(function(require, exports, module) {
	"use strict";
	const $ = require('jquery');

	module.exports = {
		flatData: function(widgets) {
			let flatData = [];
			let each = function(eachArray) {
				eachArray.forEach(function(e) {
					if (e.list && e.list.length) {
						each(e.list);
					}
					if (e.widget) {
						flatData.push(e);
					}
				});
			};
			each(widgets);
			return flatData;
		},
		storage: {
			prefix: 'WDP-',
			support: function() {
				return localStorage
			},
			set: function(key, val) {
				if (this.support) {
					if ($.isPlainObject(val) || $.isArray(val)) {
						val = JSON.stringify(val);
					};
					key = this.prefix + key;
					localStorage.setItem(key, val);
				}
			},
			get: function(key) {
				if (this.support) {
					key = this.prefix + key;
					if (localStorage.getItem(key) && (localStorage.getItem(key).match(/^\[(.*){1,}$/) || localStorage.getItem(key).match(/^\{(.+:.+,*){1,}\}$/))) {
						return JSON.parse(localStorage.getItem(key));
					};
					return localStorage.getItem(key);
				}
			},
			remove: function(key) {
				if (this.support) {
					key = this.prefix + key;
					localStorage.removeItem(key);
				}
			},
			clear: function() {
				if (this.support) {
					var prefix = this.prefix;
					for (var item in localStorage) {
						if (item.indexOf(prefix) > -1 && item.indexOf('userInfo') < 0) {
							localStorage.removeItem(item);
						}
					}
				}
			}
		},
		getDate: function() {
			let myDate = new Date();
			return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();
		},
		sortByProp: function(array, sort) {
			let output = {};
			if (Array.isArray(array)) {
				array.forEach(function(e, i) {
					if (e[sort]) {
						let thisSort = e[sort];
						if (!Array.isArray(output[thisSort])) {
							output[thisSort] = [];
						}
						output[thisSort].push(e);
					}
				});
			}
			return output;
		},
		copyArr: function(arr) {
			return arr.map((e) => {
				if (typeof e === 'object') {
					return Object.assign({}, e);
				} else {
					return e;
				}
			});
		}

	};
});