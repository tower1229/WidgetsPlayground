define(function(require, exports, module) {
	"use strict";
	seajs.importStyle(`
		.dropdown-fade-enter-active {transition: all .3s ease-in;}
		.dropdown-fade-leave-active {transition: all .3s ease-out;}
		.dropdown-fade-enter, .dropdown-fade-leave-active {transform: translateY(-10px);opacity: 0;}
		.dropdown{position:relative;}
		.dropdown-head{cursor:pointer;user-select:none;}
		.dropdown-menu{position:absolute;left:0;top:100%; padding:3px 0;}
		.dropdown-menu ul{background:#fff;border-radius:4px;color:#434343;overflow:hidden;box-shadow: 0 1px 6px rgba(0,0,0,.2);}
		.dropdown-item{padding:0 1em;line-height:2.6em;cursor:pointer;white-space:nowrap;}
		.dropdown-item:hover{background:#dedede;}`, module.uri);

	module.exports = {
		install: function(Vue, options) {
			Vue.mixin({
				components: {
					Dropdown: {
						template: `<div class="dropdown"
		        @mouseenter="handleMouseenter"
		        @mouseleave="handleMouseleave">
			<div class="dropdown-head" @click="handleClick"><slot>{{name}}</slot></div>
			<transition name="dropdown-fade">
			<div class="dropdown-menu" v-show="visible">
				<ul>
					<li class="dropdown-item" v-for="item in items" @click="onClick(item)">{{item.text}}</li>
				</ul>
			</div>
			</transition>
		</div>`,
						props: {
							name: {
								type: String,
								required: false,
								default: ""
							},
							items: {
								type: Array,
								required: true
							},
							trigger: {
								type: String,
								default: "hover"
							}
						},
						data: function() {
							let vm = this;
							return {
								visible: false,
								timeout: null,
								documentHandler: function(e) {
									if (vm.$el.contains(e.target)) {
										return false;
									}
									vm.handleClose();
								}
							};
						},
						methods: {
							handleClick() {
								if (this.trigger === 'custom') return false;
								if (this.trigger !== 'click') {
									return false;
								}
								this.visible = !this.visible;
							},
							handleMouseenter() {
								if (this.trigger === 'custom') return false;
								if (this.trigger !== 'hover') {
									return false;
								}
								clearTimeout(this.timeout);
								this.timeout = setTimeout(() => {
									this.visible = true;
								}, 250);
							},
							handleMouseleave() {
								if (this.trigger === 'custom') return false;
								if (this.trigger !== 'hover') {
									return false;
								}
								clearTimeout(this.timeout);
								this.timeout = setTimeout(() => {
									this.visible = false;
								}, 150);
							},
							handleClose() {
								if (this.trigger === 'custom') return false;
								if (this.trigger !== 'click') {
									return false;
								}
								this.visible = false;
							},
							onClick: function(item){
								this.visible = false;
								this.$emit("onClick", item);
							}
						},
						created: function() {
							document.addEventListener('click', this.documentHandler);
						},
						beforeDestroy: function() {
							document.removeEventListener('click', this.documentHandler);
						}
					}
				}
			});
		}
	};
});