define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
	};
});