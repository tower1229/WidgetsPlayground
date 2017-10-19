define(function(require, exports, module) {
	"use strict";
	const util = require('js/assets/util');
	const box = require('box');
	
	module.exports = {
		template: `<div class="playTime">
	<div class="playTime_head">
		<div class="playTime_title">{{title}}</div>
		<div class="playTime_close text-danger" @click="close"><i class="ion">&#xe647;</i></div>
	</div>
	<div class="wrap play_area">
		<div class="row" v-html="html"></div>
	</div>
	<input type="text" style="position:absolute;top:-999em;z-index:-1;" id="copyTargetInput" />
	<config-pannel v-if="playWidgets.length" 
		:widgets="playWidgets"
		:diffCode="diffCode"
		@copy="pannelCopyHandle"
		@add="addWidget"
		@updateUserConfig="genHtml"
	></config-pannel>
</div>`,
		components: {
			"config-pannel": require('js/component/config-pannel')
		},
		data: function() {
			return {
				playWidgets: [],
				html: '',
				css: '',
				js: '',
				insertPlace: '',
				diffCode: []
			};
		},
		computed: {
			choosen: function() {
				return this.$store.state.choosenWidget;
			},
			title: function() {
				let result = [];
				this.playWidgets.forEach(function(e, i) {
					result.push(e.title);
				});
				return result.join(' + ');
			}
		},
		methods: {
			genHtml: function() {
				let html = '';
				let css = '';
				let js = '';
				let vm = this;
				if (vm.playWidgets.length) {
					let scriptNode = document.getElementById('widgetJsNode');
					if (scriptNode) {
						document.body.removeChild(scriptNode);
					}
					let diff = [];
					vm.playWidgets.forEach(function(e, i) {
						let configFinnal = JSON.parse(JSON.stringify(e.confBack)); //深拷贝
						for (let x in configFinnal) {
							if (e.userConfig[x]) {
								for (let uckey in e.userConfig[x]) {
									Object.assign(configFinnal[x][uckey], e.userConfig[x][uckey]);
								}
							}
						}
						e.configFinnal = configFinnal;
						let htmlfragment = '<div class="' + 'span-' + (e.configFinnal.showConfig.viewWidth.value || 12) + '">' + etpl.compile(e.htmlTemp)(Object.assign({}, e.configFinnal.showConfig, {
							id: e.id
						})) + '</div>';
						html += vm.wrapString(htmlfragment, 'html', e.widget);
						let cssfragment = etpl.compile(e.cssTemp)(Object.assign({}, e.configFinnal.cssConfig, {
							id: e.id
						}));
						css += vm.wrapString(cssfragment, 'css', e.widget);
						let jsfragment = etpl.compile(e.jsTemp)(Object.assign({}, e.configFinnal.jsConfig, {
							id: e.id
						}));
						js += vm.wrapString(jsfragment, 'javascript', e.widget);
						//diffCode
						diff.push({
							userConfig: e.userConfig,
							widget: e.widget
						});
						vm.diffCode = diff;
					});
					console.log('组件html加载完成');
					css = css.trim();
					js = js.trim();
					if (css) {
						document.getElementById('playingCss').innerHTML = css;
						vm.css = css;
						console.log('组件css加载完成');
					}
					if (js) {
						scriptNode = document.createElement('script');
						let scriptName = vm.playWidgets[0].widget + '-script-' + parseInt(Math.random() * 1e6);
						let scriptText = `
define("${scriptName}", function(require) {
	var $ = require("jquery"),base = require("base"),com = require("js/assets/common");
	${js}
});
seajs.use("${scriptName}")`;
						scriptNode.innerHTML = scriptText;
						scriptNode.setAttribute('id', 'widgetJsNode');
						setTimeout(function() {
							document.body.appendChild(scriptNode);
							console.log('组件js加载完成');
						}, 0);
						vm.js = js;
					}
				}
				vm.html = html.trim();
			},
			promiseGet: function(road) {
				if (util.storage.get(road) !== null) {
					return new Promise(function(resolve, reject) {
						resolve({
							data: util.storage.get(road),
							config: {
								url: road
							}
						});
					});
				} else {
					return axios.get(road);
				}
			},
			getTemp: function(widgetArray, cb) {
				if (!Array.isArray(widgetArray)) {
					return [];
				}
				let vm = this;
				vm.$store.commit('callLoading', true);
				Promise.all(widgetArray.map(function(widget) {
					return vm.promiseGet(widget.conf); //axios.get(widget.conf);
				})).then(function(posts) {
					widgetArray.forEach(function(e, i) {
						e.confBack = posts[i].data;
						e.id = parseInt(Math.random() * 1e6);
						e.userConfig = e.userConfig || {};
						if (!util.storage.get(posts[i].config.url)) {
							util.storage.set(posts[i].config.url, e.confBack);
						}
						let configFinnal = JSON.parse(JSON.stringify(e.confBack)); //深拷贝
						for (let x in configFinnal) {
							if (e.userConfig[x]) {
								for (let uckey in e.userConfig[x]) {
									configFinnal[x][uckey] = e.userConfig[x][uckey];
								}
							}
						}
						e.configFinnal = configFinnal;
					});

					return Promise.all(widgetArray.map(function(widget) {
						return vm.promiseGet(widget.css);
					}));
				}).then(function(posts) {
					posts.forEach(function(e, i) {
						widgetArray[i].cssTemp = e.data;
						if (!util.storage.get(posts[i].config.url)) {
							util.storage.set(posts[i].config.url, e.data);
						}
					});
					return Promise.all(widgetArray.map(function(widget) {
						return vm.promiseGet(widget.temp);
					}));
				}).then(function(posts) {
					posts.forEach(function(e, i) {
						widgetArray[i].htmlTemp = e.data;
						if (!util.storage.get(posts[i].config.url)) {
							util.storage.set(posts[i].config.url, e.data);
						}
					});

					return Promise.all(widgetArray.map(function(widget) {
						return vm.promiseGet(widget.script);
					}));
				}).then(function(posts) {
					posts.forEach(function(e, i) {
						widgetArray[i].jsTemp = e.data;
						if (!util.storage.get(posts[i].config.url)) {
							util.storage.set(posts[i].config.url, e.data);
						}
					});
					vm.$store.commit('callLoading', false);
					if (typeof cb === 'function') {
						cb(widgetArray);
					} else {
						vm.playWidgets = widgetArray;
						vm.genHtml();
					}
				});
			},
			copy: function(text) {
				if (text) {
					let inputText = document.getElementById('copyTargetInput');
					let currentFocus = document.activeElement;
					inputText.value = text;
					inputText.focus();
					inputText.setSelectionRange(0, inputText.value.length);
					document.execCommand('copy');
					currentFocus.focus();
					box.msg('复制成功', {
						delay: 2000
					});
				} else {
					box.msg('复制内容为空', {
						delay: 2000
					});
				}
			},
			pannelCopyHandle: function(command) {
				switch (command) {
					case "html":
						this.copy(this.html);
						break;
					case "css":
						this.copy(this.css);
						break;
					case "js":
						this.copy(this.js);
						break;
					default:
						this.copy(command);
				}
			},
			getConfigArray: function(userConfig) {
				let conf = [];
				for (let x in userConfig) {
					if (userConfig.hasOwnProperty(x)) {
						let confPreFix = x + '-';
						let subConf = userConfig[x];
						for (let y in subConf) {
							let confObj = confPreFix + y + " = " + subConf[y].value;
							conf.push(confObj);
						}
					}
				}
				return conf;
			},
			close: function() {
				let vm = this;
				//保存使用数据
				let _userInfo = vm.$store.state.userInfo;
				vm.playWidgets.forEach(function(e, i) {
					let thisone = Object.assign({}, e);
					thisone.date = util.getDate();
					thisone.set = vm.getConfigArray(e.userConfig);
					_userInfo.track.record.push(thisone);
				});
				vm.$store.dispatch('setUserRecord', _userInfo);
				vm.$store.commit('setPlaying', []);
			},
			wrapString: function(string, type, decorate) {
				var _before = '',
					_after = '',
					_decorate = decorate || '';
				if (string !== '') {
					switch (type) {
						case "html":
							_before = '<!-- ' + _decorate + ' start-->\n';
							_after = '\n<!-- ' + _decorate + ' over-->\n';
							break;
						case "css":
							_before = '/* ' + _decorate + ' start*/\n';
							_after = '\n';
							break;
						default:
							_before = '// ' + _decorate + '\n';
							_after = '\n';
							break;
					}
				}
				return _before + string + _after;
			},
			addWidget: function(place) {
				this.insertPlace = place;
				this.$store.commit('setWaitToChoose', true);
			}
		},
		watch: {
			choosen: function(newVal) {
				let vm = this;
				if (newVal && vm.insertPlace) {
					vm.getTemp([newVal], function(choosenWidget) {
						switch (vm.insertPlace) {
							case 'before':
								vm.playWidgets.unshift(choosenWidget[0]);
								break;
							case 'after':
								vm.playWidgets.push(choosenWidget[0]);
								break;
							default:
								console.warn('insert place error!');
						}
						vm.genHtml();
					});
				}
			}
		},
		created: function() {
			this.getTemp(this.$store.state.playingWidgets);
		}
	};
});