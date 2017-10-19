define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
            <v-filter></v-filter>
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
    </div>`,
		components: {
			"quick-start": require('js/component/quick-start'),
			"v-filter": require('js/component/filter'),
			"component-list": require('js/component/component-list'),
			"play-time": require('js/component/play-time')
		}
	};
});