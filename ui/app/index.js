/**
 * index
 */
define(function(require, exports, module) {
	"use strict";
	const util = require('./util');
	const Storage = util.Storage;
	const box = require('box');

	const component = require('./component');
	Vue.mixin({
		components: component
	});

	const Dropdown = require('./dropdown');
	Vue.use(Dropdown);

	window.widgetRootPath = seajs.root + '/widget/';
	const widgetDataUrl = widgetRootPath + "data.json";
	//Bing壁纸
	// $.getJSON("https://jsonp.afeld.me/?callback=?&url=http%3A%2F%2Fcn.bing.com%2FHPImageArchive.aspx%3Fformat%3Djs%26idx%3D0%26n%3D1", function(data){
	//     var bing = data.url;
	//     $('.body').css('background-image','url('+bing+')');
	// });
	//document.body.style.backgroundImage = 'url("http://www.dujin.org/sys/bing/1920.php")';
	document.body.style.backgroundImage = 'url("http://ztweixin.applinzi.com/bing.php")';

	let app = new Vue({
		el: '#app',
		data: {
			userInfo: {
				name: '游客',
				track: {
					record: []
				}
			},
			widgets: [],
			flatData: [],
			version: [],
			currentNav: [],
			sortBy: '',
			keywords: '',
			bread: '',
			tags: [],
			filtertag: [],
			callCode: '',
			playingWidgets: [],
			waitToChoose: false,
			insertPlace: '',
			choosenWidget: null,
			showLoading: false
		},
		computed: {
			showingWidgets: function() {
				let result = [];
				if (this.keywords) {
					result = this.filterSearch;
				} else {
					result = this.filterChannel;
				}
				//标签筛选
				if (this.filtertag.length) {
					let newresult = [];
					let copyfiltertag = this.filtertag;
					result.forEach(function(wid, i) {
						let mytag = wid.tag.split('/');
						copyfiltertag.forEach(function(tag, o) {
							if (mytag.includes(tag)) {
								newresult.push(wid);
							}
						});
					});
					result = newresult;
				}
				//同步filtertag
				if (!this.filtertag.length) {
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
					this.tags = Array.from(mytags);
				}

				return result;
			},
			filterChannel: function() {
				let result = [];
				if (this.widgets.length) {
					let n_0 = parseInt(this.currentNav[0]);
					let n_1 = parseInt(this.currentNav[1]);

					if (!n_0 || isNaN(n_0) || n_1 === void(0) || isNaN(n_1)) {
						result = this.flatData;
						this.bread = this.widgets[0].title;
					} else {
						result = this.widgets[n_0].list[n_1].list;
						this.bread = this.widgets[[n_0]].title + ' / ' + this.widgets[n_0].list[[n_1]].title;
					}
					this.showingWidgets = result;
				}
				return result;
			},
			filterSearch: function() {
				//搜索
				let result = this.flatData;
				if (result.length && this.keywords) {
					let key = this.keywords;
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
					this.showingWidgets = result;
					return result;
				} else {
					this.showingWidgets = this.filterChannel;
				}
				return [];
			}
		},
		methods: {
			callLoading: function(bool){
				this.showLoading = !!bool;
			},
			search: function(value) {
				this.keywords = value.trim();
			},
			searchFocus: function() {
				document.getElementById("main").scrollTop = document.getElementById("welcome").offsetHeight;
			},
			mainNavClick: function(currentNav) {
				if (Array.isArray(currentNav)) {
					this.currentNav = currentNav;
				}
				this.keywords = '';
			},
			subNavClick: function(currentNav) {
				if (Array.isArray(currentNav)) {
					this.currentNav = currentNav;
				}
				this.keywords = '';
			},
			filterTag: function(tags) {
				this.filtertag = tags;
			},
			sort: function(by) {
				this.sortBy = by;
			},
			widgetClick: function(widgetObject) {
				if (this.waitToChoose) {
					this.waitToChoose = false;
					this.choosenWidget = widgetObject;
				} else {
					this.playingWidgets.push(widgetObject);
				}
			},
			callWidget: function() {
				let vm = this;
				if (vm.callCode.trim() && vm.callCode.match(/^\[(.+:.+,*){1,}\]$/)) {
					let newWidget = JSON.parse(vm.callCode);
					let result = [];
					newWidget.forEach(function(e) {
						let clean = vm.flatData.find(function(value) {
							return e.widget === value.widget;
						});
						if (e.userConfig) {
							clean.userConfig = e.userConfig;
						}
						result.push(clean);
					});
					vm.playingWidgets = result;
				} else {
					vm.callCode = '';
				}
			},
			update: function() {
				let vm = this;
				vm.showLoading = true;
				axios.get(widgetDataUrl, {
					emulateJSON: true
				}).then(response => {
					const res = response.data;
					vm.version = res.version;
					vm.widgets = res.widgets;
					vm.showLoading = false;
				});
				Storage.clear();
			},
			setUserInfo: function(info) {
				Object.assign(this.userInfo, info);
				Storage.set('userInfo', this.userInfo);
			}
		},
		created: function() {
			let vm = this;
			vm.showLoading = true;
			let userInfo = Storage.get('userInfo');
			if (userInfo) {
				vm.setUserInfo(userInfo);
			}
			axios.get(widgetDataUrl).then(response => {
				let res = response.data;
				let allwidgetsnum = 0;
				let homeIndex;
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
				each(res.widgets);
				vm.flatData = flatData;

				res.widgets.forEach(function(cell, i) {
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
				res.widgets[homeIndex].nums = allwidgetsnum;
				vm.widgets = res.widgets;
				Storage.set('widgets', res.widgets);

				if (res.version) {
					if (Storage.get('version') && (Storage.get('version').value !== res.version.value)) {
						box.alert(res.version.description, function() {
							vm.update();
						}, {
							title: "即将升级到" + res.version.value,
							oktext: "立即升级",
							bgclose: false,
							btnclose: false
						});
					} else {
						vm.version = res.version;
						Storage.set('version', res.version);
					}
				}
				vm.showLoading = false;
			});
		}
	});

});