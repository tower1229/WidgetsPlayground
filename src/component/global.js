define(function(require, exports, module) {
	"use strict";

	module.exports = {
		'loading': {
			template: `<div v-if="show" class="globalMask">
	<div class="bubblingG">
		<span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span>
	</div>
</div>`,
			computed: {
				show: function() {
					return this.$store.state.showLoading;
				}
			}
		}
	};
});