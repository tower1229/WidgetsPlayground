define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
				if (this.widgets.length > 1 && (this.widgets.length - index > 0)) {
					this.widgets.splice(index, 1);
				}
			}
		}
	};
});