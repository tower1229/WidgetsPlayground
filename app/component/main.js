define(function(require, exports, module) {
	"use strict";
	const box = require('box');
	const util = require('js/util');
	const Dropdown = require('js/component/dropdown');
	Vue.use(Dropdown);
	const wilddogApp = require('js/wilddog');

	const components = {
		'main-view': {
			template: `<div class="scroller flex-1" id="main">
        <div class="welcome" id="welcome">
            <div class="_cont wrap">
                <div class="_T">欢迎使用前端组件管理系统</div>
                <div class="_p">&emsp;&emsp;集存储、检索、调试、应用于一体的组件库2.0，旨在提高组件定制性和复用性，提高基于组件的前端开发效率。</div>
                <quick-start></quick-start>
            </div>
        </div>
        <div class="wrap mainCont">
            <!-- 筛选 -->
            <my-filter></my-filter>
            <!-- 列表 -->
            <component-list></component-list>
        </div>
        <play-time v-show="!this.$store.state.waitToChoose" v-if="this.$store.state.playingWidgets && this.$store.state.playingWidgets.length"></play-time>
        <div class="foot">
            <div>
                <p>© 2014 - 3014&emsp;
                Author 
                <a href="http://refined-x.com/" target="_blank">前端路上</a>
                &emsp;Powered By
                [ <a href="https://github.com/tower1229/Flow-UI" target="_blank">Flow-UI</a>,
                <a href="https://github.com/vuejs/vue" target="_blank">Vue</a>,
                <a href="https://www.wilddog.com" target="_blank">wilddog</a> ]
                </p>
            </div>
        </div>
    </div>`
		},
		'user-set': {
			template: `<form class="userSetForm boxLayout" v-on:submit.prevent="subInfo">
	<div class="boxHead tr">
		<i class="ion _clo" @click="close">&#xe647;</i>
	</div>
	<div class="form-group">
		<label class="control-label" for="userSetName">怎么称呼：</label>
		<input type="text" class="form-control" id="userSetName" v-model="info.displayName">
	</div>
	<button type="submit" class="btn btn-default">OK</button>
</form>`,
			computed: {
				info: {
					get: function() {
						return this.$store.state.userInfo;
					},
					set: function(value) {
						this.$store.commit('updateUserInfo', {
							displayName: value
						});
					}
				}
			},
			methods: {
				subInfo: function() {
					this.$emit('subInfo', this.info);
				},
				close: function() {
					this.$emit('close');
				}
			}
		},
		'quick-start': {
			template: `<div class="quickStart">
    <form v-on:submit.prevent="callWidget">
        <div class="form-group">
            <textarea v-model="callCode" class="form-control" id="configCode" placeholder="输入组件配置代码" spellcheck="false"></textarea>
        </div>
        <div class="form-group tc">
            <button type="submit" class="btn btn-block btn-lg btn-primary">召唤组件</button>
        </div>
    </form>
</div>`,
			computed: {
				callCode: {
					get: function() {
						return this.$store.state.callCode;
					},
					set: function(value) {
						this.$store.commit('setCallCode', value);
					}
				}
			},
			methods: {
				callWidget: function() {
					this.$store.commit('callWidget');
				}
			}
		},
		'data-count': {
			template: `<div class="userCount boxLayout">
		<div class="boxHead tr">
			<i class="ion _clo" @click="close">&#xe647;</i>
		</div>
		<table class="table" v-for="(onday, date) in track">
			<thead>
				<tr>
					<th>{{date}}</th>
				</tr>
			</thead>
			<tbody>
			<tr>
				<td>
					<dl class="dl dl-table">
						<template v-for="dayWidget in onday">
							<dt v-bind:title="dayWidget.title">{{dayWidget.widget}}</dt>
							<dd class="m-b-sm">
								<template v-if="dayWidget.set.length">
								<div class="text-primary" v-for="set in dayWidget.set"><code>{{set}}</code></div>
								</template>
								<template v-else>
								<div class="text-danger">Unmodified</div>
								</template>
							</dd>
						</template>
					</dl>
				</td>
			</tr>
		</tbody>
	</table>
</div>`,
			data: function() {
				let userTrackRecord = this.$store.state.userInfo.track.record;
				let trackData = util.sortByProp(userTrackRecord.reverse(), 'date');
				return {
					track: trackData
				};
			},
			methods: {
				close: function() {
					this.$emit('close');
				}
			}
		},
		'my-head': {
			template: `<div class="head" id="head">
	<h1 class="head_T"><a href="http://refined-x.com" target="_blank">前端组件管理系统</a></h1>
	<div class="head_right form-inline">
		<span class="form-control-static"><i class="ion">&#xe736;</i> {{info.displayName}}</span>
		<Dropdown class="btn btn-primary" 
			:items="menuItems"
			@onClick="menuClick"
		>菜单</Dropdown>
		<a href="https://github.com/tower1229/WidgetsPlayground" target="_blank" class="btn btn-success" id="issue"><i class="ion">&#xe6b5;</i>源码</a>
		<a href="https://github.com/tower1229/WidgetsPlayground/issues" target="_blank" class="btn btn-warning" id="issue"><i class="ion">&#xe637;</i>反馈</a>
	</div>
	<div class="search" v-bind:class="focusClass">
		<input id="globalSearch" class="form-control input-lg" type="text" placeholder="搜索：组件名称、编号、标签..." 
		@keypress="input" @enter="input" @focus="focus" @blur="blur">
	</div>
	<user-set v-if="popwin==='userset'" :info="info" @subInfo="subInfo" @close="popwin=''"></user-set>
	<data-count v-if="popwin==='dadtacount'" @close="popwin=''"></data-count>
</div>`,
			computed: {
				info: function() {
					return this.$store.state.userInfo
				}
			},
			data: function() {
				return {
					focusClass: '',
					menuItems: [{
						text: '个人设置',
						win: 'userset'
					}, {
						text: '数据统计',
						win: 'dadtacount'
					}, {
						text: '立即更新',
						win: 'checkupdate'
					}, {
						text: '退出',
						win: 'logout'
					}],
					popwin: ''
				};
			},
			methods: {
				input: function(event) {
					let vm = this;
					setTimeout(function() {
						vm.$store.commit('search', event.target.value);
					}, 0);
				},
				focus: function() {
					this.focusClass = 'focus';
					this.$store.commit('scrollTop');
				},
				blur: function(event) {
					let vm = this;
					this.focusClass = '';
					setTimeout(function() {
						vm.$store.commit('search', event.target.value);
					}, 0);
				},
				menuClick: function(item) {
					let vm = this;
					switch (item.win) {
						case "logout":
							wilddogApp.auth().signOut().then(function() {
								box.hide();
								vm.$router.push('/login');
							}).catch(function(error) {
								box.msg(error, {
									color: 'danger'
								});
							});
							break;
						case "checkupdate":
							util.storage.clear();
							vm.$store.dispatch('update');
							break;
						default:
							vm.popwin = item.win;
					}
				},
				subInfo: function(info) {
					this.$store.dispatch('setUserInfo', info);
					this.popwin = '';
				}
			}
		},
		'my-nav': {
			template: `<div class="menu-bar" id="nav">
	<ul class="main-nav">
		<li v-for="(main,index) in navdata" :class="['main-nav-'+index, currentNav[0]==index ? 'cur' : '']" 
			@mouseenter="mainNavIn(index)"
			@mouseleave="mainNavOut"
			@click="mainNavClick(index)">
			<router-link :to="{ path: index ? '/channel/' + index : '/'}">
			<i class="ion" v-html="main.icon"></i>
			<span>{{main.title}}</span> ({{main.nums}})
			</router-link>
		</li>
	</ul>
	<div class="sub-nav" :class="hoverMenu!=='' ? 'show' : ''">
		<ul v-if="sub.list" v-show="hoverMenu===index" v-for="(sub,index) in navdata" :class="'sub-nav-'+index"
			@mouseenter="subNavIn"
			@mouseleave="subNavOut"
			@click="subNavClick">
			<li v-for="(subnav,index2) in sub.list" :class="['sub-nav-'+index+'-'+index2, currentNav[1]==index2 ? 'cur' : '']" :data-nav="index+','+index2">
			<router-link :to="{ path: '/channel/' + index + '/type/' + index2 }">
				{{subnav.title}} ({{subnav.list.length}})
			</router-link>
			</li>
		</ul>
	</div>
</div>`,
			computed: {
				navdata: function() {
					return this.$store.getters.navData;
				}
			},
			data: function() {
				return {
					hoverMenu: '',
					currentNav: ['0', '0'],
					navSync: null
				};
			},
			methods: {
				mainNavIn: function(index) {
					if (this.navdata[index].list) {
						this.hoverMenu = index;
						clearTimeout(this.navSync);
					} else {
						this.hoverMenu = '';
					}
				},
				mainNavOut: function() {
					var that = this;
					that.navSync = setTimeout(function() {
						that.hoverMenu = '';
					}, 160);
				},
				mainNavClick: function(index) {
					this.$store.commit('scrollTop');
				},
				subNavIn: function() {
					clearTimeout(this.navSync);
				},
				subNavOut: function() {
					var that = this;
					that.navSync = setTimeout(function() {
						that.hoverMenu = '';
					}, 160);
				},
				subNavClick: function(event) {
					this.$store.commit('scrollTop');
				},
				getNav: function(router) {
					if (router.params.cid !== void 0) {
						this.currentNav.splice(0, 1, router.params.cid);
					} else {
						this.currentNav.splice(0, 1, '0');
					}
					if (this.$route.params.tid !== void 0) {
						this.currentNav.splice(1, 1, router.params.tid);
					} else {
						this.currentNav.splice(1);
					}
					this.$store.commit('updateNav', this.currentNav);
				}
			},
			watch: {
				$route: function(to, from) {
					this.getNav(to);
				}
			},
			created: function() {
				this.getNav(this.$route);
			}
		},
		'component-list': {
			template: `<div class="widget-list" id="widgetList">
	<transition-group name="list" tag="ul" class="row">
		<li v-if="!widgets.length" class="span-12" :key="0">
			<p class="widget_empty_tip">组件去哪儿了？</p>
		</li>
		<li v-for="(widget,index) in widgets" class="span-3 midd-4 smal-12"
			:key="index"
			@click="liClick(widget.widget)">
			<div class="_layer">
				<div class="_album rect-618"><img :src="widget.album" @error="albumerror" class="_full"></div>
				<h4 class="_t el">{{widget.title}}</h4>
				<p>作者：{{widget.author}}</p>
				<p>日期：{{widget.date}}</p>
				<div class="_name"><span>{{widget.widget}}</span></div>
			</div>
		</li>
	</transition-group>
</div>`,
			computed: {
				showingWidgets: function() {
					return this.$store.getters.showingWidgets;
				},
				sort: function() {
					return this.$store.state.sortBy;
				},
				widgets: function() {
					let dateToNum = function(dataType) {
						var _num = 0,
							_array = dataType.split('-');
						if (_array.length === 3) {
							_num += parseInt(_array[0]) * 10000;
							_num += parseInt(_array[1]) * 100;
							_num += parseInt(_array[2]);
						}
						return _num;
					};
					let result;
					switch (this.sort) {
						case 'title':
							result = this.showingWidgets.sort(function(a, b) {
								return a.title.localeCompare(b.title);
							});
							break;
						case 'date':
							result = this.showingWidgets.sort(function(a, b) {
								return dateToNum(b.date) - dateToNum(a.date);
							});
							break;
						default:
							result = this.showingWidgets;
							break;
					}
					result.forEach(function(e, i) {
						const widgetInfo = e.widget.split('-');
						let widgetPath = seajs.widgetRootPath + '/' + widgetInfo[0] + '/';
						const widgetExt = {
							temp: 'temp.htm',
							css: 'style.css',
							script: 'script.js',
							album: 'album.jpg',
							conf: 'config.json'
						};
						if (widgetInfo.length === 2) {
							widgetPath += (widgetInfo[1] + '/');
						}
						for (let x in widgetExt) {
							e[x] = widgetPath + widgetExt[x];
						}
					});

					return result;
				}
			},
			methods: {
				liClick: function(widgetName) {
					if (widgetName) {
						let widget = this.widgets.find(function(value) {
							return value.widget === widgetName;
						});
						this.$store.dispatch('widgetClick', widget);
					}
				},
				albumerror: function(event) {
					event.target.src = seajs.root + '/images/nopic.jpg';
				}
			}
		},
		'my-filter': {
			template: `<div class="filter" id="filter">
    <form>
        <fieldset>
            <legend>{{bread}}</legend>
            <div class="form-group tagWrap" id="tagWrap">
                <label>标签：</label>
                <span class="btn btn-primary btn-sm chooseAll" :class="showtag.length ? '' : 'active'"
                	@click="allClick">全部</span>
                <span v-for="tag in tags" class="btn btn-primary btn-sm" 
					:class="includes(tag) ? 'active' : ''"
                    @click="tagClick">{{tag}}</span> 
            </div>
            <div class="form-group" id="sortWrap">
                <label>排序：</label>
                <span class="btn btn-default" :class="sortBy === 'title' ? 'active' : ''" @click="triggerSort('title')">名称排序</span>
                <span class="btn btn-default" :class="sortBy === 'date' ? 'active' : ''" @click="triggerSort('date')">时间排序</span>
            </div>
        </fieldset>
    </form>
</div>`,
			computed: {
				tags: function() {
					return this.$store.state.tags;
				},
				bread: function() {
					return this.$store.state.bread;
				}
			},
			data: function() {
				return {
					showtag: [],
					sortBy: ''
				};
			},
			methods: {
				includes: function(tag) {
					let vm = this;
					return util.arrIncludes(vm.showtag, tag);
				},
				tagClick: function(event) {
					let text = event.target.innerText;
					let index = this.showtag.findIndex(function(value) {
						return value === text;
					});
					if (index > -1) {
						this.showtag.splice(index, 1);
					} else {
						this.showtag.push(text);
					}
					this.doFilter();
				},
				allClick: function() {
					this.showtag = [];
					this.doFilter();
				},
				triggerSort: function(by) {
					if (this.sortBy === by) {
						this.sortBy = '';
					} else {
						this.sortBy = by;
					}
					this.doFilter();
				},
				doFilter: function(to) {
					let thePath = to ? to.path : null;
					let theQuery = {};
					if (this.showtag.length) {
						theQuery.tag = JSON.stringify(this.showtag);
					}

					if (this.sortBy) {
						theQuery.sort = this.sortBy;
					}

					this.$router.push({
						path: thePath,
						query: theQuery
					});

					this.$store.commit('filterTag', this.showtag);
					this.$store.commit('sort', this.sortBy);
				}
			},
			created: function() {
				if (this.$route.query.tag) {
					this.showtag = JSON.parse(this.$route.query.tag);
				}
				if (this.$route.query.sort) {
					this.sortBy = this.$route.query.sort;
				}
				this.doFilter();
			}
		},
		'play-time': {
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
	var $ = require("jquery"),base = require("base"),com = require("js/common");
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
						return vm.promiseGet(widget.conf);	//axios.get(widget.conf);
					})).then(function(posts) {
						widgetArray.forEach(function(e, i) {
							e.confBack = posts[i].data;
							e.id = parseInt(Math.random() * 1e6);
							e.userConfig = e.userConfig || {};
							if(!util.storage.get(posts[i].config.url)){
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
							if(!util.storage.get(posts[i].config.url)){
								util.storage.set(posts[i].config.url, e.data);
							}
						});
						return Promise.all(widgetArray.map(function(widget) {
							return vm.promiseGet(widget.temp);
						}));
					}).then(function(posts) {
						posts.forEach(function(e, i) {
							widgetArray[i].htmlTemp = e.data;
							if(!util.storage.get(posts[i].config.url)){
								util.storage.set(posts[i].config.url, e.data);
							}
						});

						return Promise.all(widgetArray.map(function(widget) {
							return vm.promiseGet(widget.script);
						}));
					}).then(function(posts) {
						posts.forEach(function(e, i) {
							widgetArray[i].jsTemp = e.data;
							if(!util.storage.get(posts[i].config.url)){
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
		},
		'config-pannel': {
			template: `<div class="playTime_panel">
    <div :class="showingPannel==='config' ? 'show' : ''" class="_configpanel playTime_mark">
        <div class="_tag" @click="togglePannel('config')">配置面板</div>
        <form class="panelWrap p form-horizontal config-pannel" @change="configChange($event.target)">
        	<template v-for="(widget, index) in widgets">
            <h5 class="tc m-b-sm">{{widget.title + '/' + widget.widget}}</h5>
        	<div v-for="(configObject, configName) in widget.configFinnal" class="section">
                <div v-if="key !== 'id'" v-for="(item,key) in configObject" class="form-group form-group-sm row">
                    <label class="control-label span-6" :for="key">{{item.name}}：</label>
                    <div class="span-5">
                        <select v-if="item.type=='select'" :data-key="key" :data-item="configName" :data-index="index" class="form-control">
                            <option v-for="option in item.option" :value="option" v-bind:selected="option==item.value">{{option}}</option>
                        </select>
                        <input v-else :data-key="key" :data-item="configName" :data-index="index" :type="item.type" class="form-control" :value="item.value">
                    </div>
                </div>
            </div>
            </template>
            <div class="row">
                <div class="span-10 center">
					<button type="button" class="btn btn-block btn-primary" @click="reset">恢复默认配置</button>
                </div>
            </div>
        </form>
    </div>
    <div :class="showingPannel==='queue' ? 'show' : ''" class="_getmerge playTime_mark">
        <div class="_tag" @click="togglePannel('queue')">组件合并</div>
        <div class="panelWrap p-lr">
            <form class="mergeQueue flex-col">
                <div class="btn btn-block btn-success _before" @click="add('before')"><i class="ion">&#xe60b;</i></div>
                <ul class="_queue flex-1">
					<li v-for="(wid, index) in widgets" :style="{backgroundImage: 'url('+wid.album+')'}" class="m-tb-sm">
						<div class="_layer p">
							<div class="_del text-danger" 
								@click="delQueue(index)"
							><i class="ion">&#xe647;</i></div>
							<h5>{{wid.widget}}</h5>
							<p>{{wid.title}}</p>
						</div>
					</li>
                </ul>
                <div class="btn btn-block btn-success _after" @click="add('after')"><i class="ion">&#xe60b;</i></div>
            </form>
        </div>
    </div>
    <div :class="showingPannel==='generate' ? 'show' : ''" class="_getconfig playTime_mark">
        <div class="_tag" @click="togglePannel('generate')">获取代码</div>
        <div class="panelWrap p-lr">
            <form class="flex-col">
                <div class="form-group">
                    <button type="button" class="btn btn-block btn-primary btn-lg" @click="copyDiff">复制配置代码</button>
                </div>
                <div class="form-group flex-1">
                    <textarea class="form-control configCodeBox" id="configCodeBox" :value="JSON.stringify(diffCode)"></textarea>
                </div>
                <div class="form-group">
	                <div class="btn btn-block btn-default btn-lg" @click="copyHTML">复制HTML到剪贴板</div>
		        	<div class="btn btn-block btn-info btn-lg" @click="copyCSS">复制CSS到剪贴板</div>
		        	<div class="btn btn-block btn-primary btn-lg" @click="copyJS">复制JS到剪贴板</div>
	        	</div>
            </form>
        </div>
    </div>
</div>`,
			props: ['widgets', 'diffCode'],
			data: function() {
				return {
					showingPannel: '',
					timer: null
				};
			},
			methods: {
				togglePannel: function(pannelName) {
					if (this.showingPannel === pannelName) {
						this.showingPannel = '';
					} else {
						this.showingPannel = pannelName;
					}
				},
				configChange: function(target) {
					let vm = this;
					let key = target.dataset.key;
					let val = isNaN(parseFloat(target.value)) ? target.value : parseFloat(target.value);
					let configItem = target.dataset.item;
					let widgetIndex = target.dataset.index;
					if (!vm.widgets[widgetIndex].userConfig[configItem]) {
						vm.widgets[widgetIndex].userConfig[configItem] = {};
					}
					if (!vm.widgets[widgetIndex].userConfig[configItem][key]) {
						vm.widgets[widgetIndex].userConfig[configItem][key] = {};
					}
					vm.widgets[widgetIndex].userConfig[configItem][key].value = val;
					vm.$emit('updateUserConfig');
				},
				reset: function() {
					let vm = this;
					vm.widgets.forEach(function(e, i) {
						e.userConfig = {};
						Vue.set(vm.widgets, i, e);
					});
					vm.$emit('updateUserConfig');
				},
				copyDiff: function() {
					this.$emit('copy', JSON.stringify(this.diffCode));
				},
				copyHTML: function() {
					this.$emit('copy', 'html');
				},
				copyCSS: function() {
					this.$emit('copy', 'css');
				},
				copyJS: function() {
					this.$emit('copy', 'js');
				},
				add: function(place) {
					this.$emit('add', place);
				},
				delQueue: function(index) {
					if (this.widgets.length > 1 && (this.widgets.length - index > 0))
						this.widgets.splice(index, 1);
				}
			}
		}

	};

	Vue.mixin({
		components
	});

	module.exports = {
		template: `<div class="body flex-col">
    <my-head></my-head>
    <div class="flex-1 flex-col main">
        <my-nav></my-nav>
        <main-view></main-view>
    </div>
</div>`,
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
	};
});