define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
				event.target.src = seajs.root + '/static/images/nopic.jpg';
			}
		}
	};
});