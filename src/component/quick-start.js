define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
	};
});