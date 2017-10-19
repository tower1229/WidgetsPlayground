define(function(require, exports, module) {
	"use strict";

	module.exports = {
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
	};
});