define(function(require, exports, module) {
	"use strict";
	const util = require('js/assets/util');
	
	module.exports = {
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
	};
});