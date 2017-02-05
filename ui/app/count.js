/*
 * count
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	var com = require('./common');
	var util = require('./util');
	var etpl = util.etpl;
	var Storage = util.Storage;
	var jrChannel = util.jrChannel;
	var random = util.random;
	var index = require('./index');
	//野狗数据库
	var database = new Wilddog("https://wild-boar-02388.wilddogio.com");
	require('box');
	require('select');

	//新用户标识
	var isNew = false;
	/*
	 * 由无序数组生成根据指定索引归纳的对象
	 * 输入[a,b,c] 
	 * 输出{sort1:[a,b], sort2:[c]}
	 */
	var changeSort = function(array, sort) {
		if (!array.length) return;
		var output = {};
		for (var i = 0; i < array.length; i++) {
			if (array[i][sort]) {
				var thisSort = array[i][sort];
				if (output[thisSort] && output[thisSort].length) {
					output[thisSort].push(array[i]);
				} else {
					output[thisSort] = [];
					output[thisSort].push(array[i]);
				}
			}
		}
		return output;
	};
	/*
	 *  通过组件id获取组件name
	 */
	var getNameByID = function(id) {
		var array = Storage.get('widgetData').widgets;
		for (var i = 0; i < array.length; i++) {
			if (array[i].list && array[i].list.length) {
				var _subArray = array[i].list;
				for (var u = 0; u < _subArray.length; u++) {
					if (_subArray[u].list && _subArray[u].list.length) {
						var _finnallist = _subArray[u].list;
						for (var o = 0; o < _finnallist.length; o++) {
							if (_finnallist[o].widget == id) {
								return _finnallist[o].title;
							}
						}
					}
				}
			}

		};
	};
	/*
	 * 将用户配置转成数组格式
	 */
	var getConfigArray = function(userConfig) {
		var conf = [];
		for (var x in userConfig) {
			var confPreFix = x + '-';
			var subConf = userConfig[x];
			for (var y in subConf) {
				var confObj = "";
				var confItem = confPreFix + y;
				var confValue = subConf[y].value;
				confObj = confItem + "=" + confValue;
				conf.push(confObj);
			}
		}
		return conf;
	}

	var init = function() {
		var userInfo = {};
		if (!Storage.get('userInfo') || !Storage.get('userInfo').id) {
			var rand = random();
			userInfo.id = '用户' + rand;
			userInfo.name = '用户' + rand;
			userInfo.track = {
				"record": []
			};
			Storage.set('userInfo', userInfo);
			isNew = true;
		}

		//用户菜单
		(function() {
			var appendUserMenu = function() {
				var userMenuDate = [{
					"option": Storage.get('userInfo').name,
					"value": 0,
					"selected": true
				}, {
					"option": "<i class='ion'>&#xe634;</i>个人设置",
					"value": 2
				}, {
					"option": "<i class='ion'>&#xe64d;</i>数据统计",
					"value": 1
				}, {
					"option": "<i class='ion'>&#xe670;</i>立即更新",
					"value": 3
				}];
				!$('#userMenu').length && $('.head_right').prepend('<select id="userMenu" class="userMenu"></select>');

				$('#userMenu').select({
					data: userMenuDate,
					hideSelected: true,
					onChange: function(v) {
						userMenuCase(v);
					}
				});
			}

			//分发菜单事件
			var userMenuCase = function(v) {
				switch (v) {
					case 1:
						//统计
						var etplEngine = new etpl.Engine(),
							template = Storage.get('template');
						etplEngine.compile(template)
						var Render = etplEngine.getRenderer('count');
						var userTrackRecord = Storage.get('userInfo').track.record;
						//console.log(userTrack)
						var trackByDate = changeSort(userTrackRecord.reverse(), 'date');
						//console.log(trackByDate);
						var userCount = Render({
							track: trackByDate
						});

						var usercountbox = $.box(userCount, {
							title: "简陋的数据统计",
							width: 700,
							bgclose: false,
							onshow: function() {
								$('html').addClass('docStatic');
							},
							onclose: function() {
								appendUserMenu();
								$('html').removeClass('docStatic');
							}
						})

						break;
					case 2:
						//设置
						var etplEngine = new etpl.Engine(),
							template = Storage.get('template');
						etplEngine.compile(template)
						var Render = etplEngine.getRenderer('userSet');
						var _userInfo = Storage.get('userInfo');
						var userSetForm = Render(_userInfo);

						var usersetbox = $.box(userSetForm, {
							title: false,
							width: 500,
							onshow: function() {
								$('#userSetForm').on('submit', function(e) {
									e.preventDefault();
									var userSetName = $.trim($('#userSetName').val());
									if (userSetName != '') {
										_userInfo.name = userSetName;
										Storage.set('userInfo', _userInfo);
									};
									$.box.hide(usersetbox);
								})
							},
							onclose: function() {
								appendUserMenu();
							}
						})
						break;
					case 3:
						//更新
						Storage.clear();
						index.init();
						appendUserMenu();
						break;
				}
			};
			appendUserMenu();
		})();

		//捕捉用户生成配置事件
		$('body').on('getConfig', function() {
			console.log('getConfig')
			if (isNew) {
				$.box.alert('第一次用？为了进一步提升品质，组件库会统计你的使用行为。', null, {
					oktext: '我知道了',
					bgclose: false,
					btnclose: false
				});
				isNew = false;
			}
			var theConfig = JSON.parse($('#configCodeBox').val());
			var _userInfo = Storage.get('userInfo');
			$.each(theConfig,function(i,e){
				var thisWidget = {
					widgetID: e.widget,
					widgetName: getNameByID(e.widget),
					set: getConfigArray(e.userConfig),
					date: util.getDate()
				};
				_userInfo.track.record.push(thisWidget);
			});
			
			Storage.set('userInfo', _userInfo);
		})
	}

	module.exports = init;

})