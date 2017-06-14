define(function(require, exports, module) {
	"use strict";
	const util = require('js/util');
	const box = require('box');
	const notice = require('notice');
	const wilddogApp = require('js/wilddog');
	
	module.exports = {
		setUserRecord: function(context, user) {
			let ref = wilddogApp.sync().ref();
            ref.child('/users/' + user.uid + '/track').set({
                "record": JSON.stringify(user.track.record)
            }, function(error) {
                if (error) {
                    box.msg(error, {
                        color:'danger'
                    });
                }else{
                    console.log('同步用户记录到野狗云端成功');
                }
            });
		},
		setUserInfo: function(context, info) {
			let currentUser = wilddogApp.auth().currentUser;
			return new Promise(function(resolve, reject) {
				if (info && currentUser) {
					currentUser.updateProfile({
							'photoURL': info.photoUrl || '',
							'displayName': info.displayName || '',
						})
						.then(function(user) {
							context.commit('updateUserInfo', user);
							resolve(user);
						})
						.catch(function(err) {
							console.info("update user info failed.", err);
						});
				} else {
					reject(error);
				}
			});
		},
		update: function(context) {
			context.commit('callLoading', true);
			axios.get(seajs.widgetRootPath + "/data.json", {
				emulateJSON: true
			}).then(response => {
				let res = response.data;
				let localVersion = util.storage.get('version');
				if (localVersion && (localVersion.value !== res.version.value)) {
					util.storage.clear();
					notice({
	                    title: "升级到" + res.version.value,
	                    desc: res.version.description
	                });
				}
				context.commit('setVersion', res.version);
				context.commit('setWidgets', res.widgets);
				context.commit('callLoading', false);
			});

		},
		widgetClick: function(context, widgetObject) {
			if (context.state.waitToChoose) {
				context.commit('setWaitToChoose', false);
				context.commit('setChoosen', widgetObject);
			} else {
				let _playingWidgets = context.state.playingWidgets;
				_playingWidgets.push(widgetObject);
				context.commit('setPlaying', _playingWidgets);
			}
		}
	};
});