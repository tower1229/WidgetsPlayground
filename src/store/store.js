define(function(require, exports, module) {
	"use strict";
	const util = require('js/assets/util');
	const getters = require('./getters');
	const mutations = require('./mutations');
	const actions = require('./actions');
	
	const store = new Vuex.Store({
		state: {
			userInfo: {
				displayName: '',
				phone: '',
				email: '',
				photoURL: '',
				emailVerified: false,
				uid:'',
				track: {
					record: []
				}
			},
			widgets: [],
			version: [],
			currentNav: [],
			sortBy: '',
			keywords: '',
			bread: '',
			tags: [],
			filtertag: [],
			callCode: '',
			playingWidgets: [],
			waitToChoose: false,
			insertPlace: '',
			choosenWidget: null,
			showLoading: false
		},
		getters,
		mutations,
		actions
	});

	module.exports = store;
});