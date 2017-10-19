define(function(require, exports, module) {
	"use strict";
	const wilddogApp = require('js/assets/wilddog');
	const Dropdown = require('js/plugin/dropdown');
	Vue.use(Dropdown);
	const util = require('js/assets/util');
	const UserSet = require('js/component/user-set');
	const DataCount = require('js/component/data-count');

	module.exports = {
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
		components: {
			"user-set": UserSet,
			"data-count": DataCount
		},
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
	};
});