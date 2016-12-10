/*
 * play
 * update: playground动态尺寸
 * date: 2015-09-20
 */
define(function(require, exports, module) {
	"use strict";
	var $ = require('jquery');
	var base = require('base');
	var com = require('./common');
	var util = require('./util');
	var etpl = util.etpl;
	var Storage = util.Storage;
	var jrChannel = util.jrChannel;
	base.ajaxSetup($);
	//准备数据
	var globalWidgets = util.getWidgets(Storage.get('widgetData').widgets, 0);
	var template = Storage.get('template');
	var widgetSelectHtml = function() {
		var etplEngine = new etpl.Engine();
		etplEngine.compile(template);
		var Render = etplEngine.getRenderer('widgetList');
		return '<div class="widget-list innerList" id="selectWidget">' + Render(globalWidgets) + '</div>';
	};
	var headHeight = $('#head').outerHeight();
	//演示组件队列
	var widgetQueue = [];
	var play = function(Widget, userConfig) {
		if (!$.isArray(Widget)) {
			console.log('play(Widget,userConfig)第一个参数' + Widget + '不是数组格式');
		}
		//去滚动条
		$('html').addClass('docStatic');
		window.playing = true;
		var etplEngine = new etpl.Engine();
		etplEngine.compile(template);
		var Render = etplEngine.getRenderer('playTime');
		var playTime = Render({
			Widget: Widget[0],
			viewWidth: 10
		});

		var playBoxObj = $.box(playTime, {
			layout: false,
			bg: false,
			width: 9999,
			height: 9999,
			top: headHeight,
			onshow: function() {
				$('#playTime').on('click', '.playTime_close', function() {
					if ($('#configPanel .show').length) {
						$('#configPanel .show').removeClass('show');
					}
					$('html').removeClass('docStatic');
					$.box.hide();
					clearWidget();
				});
				widgetQueue = Widget;
				initWidget(userConfig);
			}
		});
	};

	var initWidget = function(userConfig) {
		util.loading.show();
		var getWidgetConfig = function(userConfig) {
			Storage.set("widgetConfigBack", widgetQueue);
			var widgetConfig = {};
			$.each(widgetQueue, function(i, e) {
				//深拷贝
				$.extend(true, widgetConfig, e.confBack);
			});
			$.extend(true, widgetConfig, userConfig || {});

			//扩展id
			(function() {
				for (var x in widgetConfig) {
					if (widgetConfig.hasOwnProperty(x) && x !== "id") {
						widgetConfig[x].id = widgetQueue[0].id;
					}
				}
			})();
			//组件演示宽度
			if (widgetConfig.showConfig && widgetConfig.showConfig.viewWidth) {
				$('#playView').attr('class', 'center span-' + widgetConfig.showConfig.viewWidth);
			}

			paintWidget(widgetQueue, widgetConfig, {
				withPanel: true
			});
		};

		if (widgetQueue.length) {
			var scriptsCount = 0;
			var scriptsLength = widgetQueue.length;
			var getNext = function(isLast) {
				if (isLast) {
					getWidgetConfig(userConfig);
				} else {
					//生成组件id
					var wid = "wid" + util.random();
					var Widget = widgetQueue[scriptsCount];
					$.ajax({
						url: Widget.config,
						cache: false,
						dataType: 'json',
						success: function(res) {
							widgetQueue[scriptsCount].confBack = res;
							widgetQueue[scriptsCount].id = wid;
							scriptsCount++;
							getNext(scriptsLength <= scriptsCount);
						},
						error: function() {
							scriptsCount++;
							getNext(scriptsLength <= scriptsCount);
						}
					});
				}

			};
			getNext();
		}
	};
	//清除widget
	var clearWidget = function() {
		$('#widgetCssNode').remove();
		$('#widgetJsNode').remove();

		Storage.remove("widgetConfigBack");
		Storage.remove("HTML");
		Storage.remove("CSS");
		Storage.remove("JS");

		window.playing = null;
	};

	var paintWidget = function(widgetQueue, widgetConfig, option) {
		var opt = $.extend({
			withPanel: false,
			place: null
		}, option || {});

		//代码块包装
		var wrapString = function(string, type, decorate) {
			var _before = '',
				_after = '',
				_decorate = decorate || '';
			if (string !== '') {
				switch (type) {
					case "html":
						_before = '<!-- ' + _decorate + ' start-->\n';
						_after = '\n<!-- ' + _decorate + ' over-->\n';
						break;
					case "css":
						_before = '/* ' + _decorate + ' start*/\n';
						_after = '\n';
						break;
					default:
						_before = '// ' + _decorate + '\n';
						_after = '\n';
						break;
				}
			}
			return _before + string + _after;
		};
		//get temp
		var getTemp = function(cb) {
			if (widgetQueue.length) {
				var scriptsCount = 0;
				var scriptsLength = widgetQueue.length;
				var resultCache = '';
				var getNext = function(isLast) {
					if (isLast) {
						Storage.set('HTML', resultCache);
						$('#playView').html(resultCache);
						console.log('组件temp加载完成');
						typeof(cb) === 'function' && cb();
					} else {
						var Widget = widgetQueue[scriptsCount];
						$.ajax({
							url: Widget.temp,
							cache: false,
							dataType: 'html',
							success: function(res) {
								var etplEngine = new etpl.Engine();
								var render = etplEngine.compile(res);
								var result = $.trim(render(widgetConfig.showConfig));
								resultCache += wrapString(result, 'html', widgetQueue[scriptsCount].widget);
								scriptsCount++;
								getNext(scriptsLength <= scriptsCount);
							},
							error: function() {
								console.warn(Widget.widget + '组件模板未加载！');
							}
						});
					}
				};
				getNext();
			}
		};

		//get css
		var getCss = function(cb) {
			if (!$('#widgetCssNode').length) {
				$('head').append('<style id="widgetCssNode"></style>');
			}
			if (widgetQueue.length) {
				var resultCache = '';
				var scriptsCount = 0;
				var scriptsLength = widgetQueue.length;
				var getNext = function(isLast) {
					if (isLast) {
						Storage.set('CSS', resultCache);
						$('#widgetCssNode').html(resultCache);
						console.log('组件css加载完成');
						typeof(cb) === 'function' && cb();
					} else {
						var Widget = widgetQueue[scriptsCount];
						if ($.isPlainObject(Widget)) {
							$.ajax({
								url: Widget.css,
								cache: false,
								dataType: 'text',
								success: function(res) {
									var etplEngine = new etpl.Engine();
									var render = etplEngine.compile(res);
									var result = $.trim(render(widgetConfig.cssConfig)).replace('"/widget','"' + seajs.root + '/widget');
									resultCache += wrapString(result, 'css', widgetQueue[scriptsCount].widget);
									scriptsCount++;
									getNext(scriptsLength <= scriptsCount);
								},
								error: function() {
									console.warn(Widget.widget + '组件样式未加载！');
								}
							});
						}
					}
				};
				getNext();
			}
		};
		//get script
		var getScript = function(cb) {
			if ($('#widgetJsNode').length) {
				$('#widgetJsNode').remove();
			}
			if (widgetQueue.length) {
				var resultCache = '';
				var scriptsCount = 0;
				var scriptsLength = widgetQueue.length;
				var getNext = function(isLast) {
					if (isLast) {
						var jsRandom = util.random();
						var jsNode = '<script id="widgetJsNode">\
								\ndefine("' + widgetQueue[0].widget + '-script-' + jsRandom + '", function(require) {\
										\nvar $ = require("jquery"),base = require("base"),com = require("js/common");\n';
						jsNode += resultCache;
						jsNode += '\n})';
						jsNode += ('\nseajs.use("' + widgetQueue[0].widget + '-script-' + jsRandom + '")');
						jsNode += '\n</script>';
						setTimeout(function() {
							Storage.set('JS', resultCache);
							try{
								$('body').append(jsNode);
							}catch(e){
								console.error(e);
							}
							console.log('组件js加载完成');
							typeof(cb) === 'function' && cb();
						}, 0);
					} else {
						var Widget = widgetQueue[scriptsCount];
						$.ajax({
							url: Widget.script,
							cache: false,
							dataType: 'text',
							success: function(res) {
								var etplEngine = new etpl.Engine();
								var render = etplEngine.compile(res);
								var result = $.trim(render(widgetConfig.jsConfig));
								resultCache += wrapString(result, 'js', widgetQueue[scriptsCount].widget);
								scriptsCount++;
								getNext(scriptsLength <= scriptsCount);
							},
							error: function() {
								console.warn(Widget.widget + '组件js未加载！');
							}
						});
					}
				};
				getNext();
			}
		};
		//获取组件三部分
		getCss(function() {
			getTemp(function() {
				getScript(function() {
					if (opt.withPanel) {
						creatPanel(widgetConfig);
					}
				});
			});
		});
	};
	var initCopy = function() {
		//复制代码
		require('copy');
		var copyResult = function(str) {
			//$('#copyResult').text(str);
			$.box.msg(str, {
				delay: 1000
			});
		};
		//HTML
		$('#copyHTML').zclip({
			copy: function() {
				return Storage.get("HTML");
			},
			afterCopy: function() {
				copyResult("HTML代码复制成功");
			}
		});
		//CSS
		$('#copyCSS').zclip({
			copy: function() {
				return Storage.get("CSS");
			},
			afterCopy: function() {
				copyResult("CSS代码复制成功");
			}
		});
		//JS
		$('#copyJS').zclip({
			copy: function() {
				return Storage.get("JS");
			},
			afterCopy: function() {
				copyResult("JS代码复制成功");
			}
		});
		//configCode
		$('#copyConfigCode').zclip({
			copy: function() {
				return $('#configCodeBox').val();
			},
			afterCopy: function() {
				copyResult("配置代码复制成功");
			}
		});

	};
	//插入组件
	var insertWidget = function(place) {
		var selectWidgetBox = $.box(widgetSelectHtml, {
			bg: false,
			top: headHeight,
			height: 9999,
			width: 9999,
			hook: 'choosewidget',
			onshow: function($this) {
				$this.on('click', '.widget-list li', function() {
					var name = $(this).data('name');
					$.each(globalWidgets.widgets, function(i, e) {
						if (e.widget == name) {
							if (place === 'before') {
								widgetQueue.unshift(e);
							} else if (place === 'after') {
								widgetQueue.push(e);
							}
							createQueue(widgetQueue);
							return false;
						}
					});
					$.box.hide(selectWidgetBox);
				});
			}
		});
	};
	//创建配置面板
	var createQueue = function(widgetQueue) {
		var etplEngine = new etpl.Engine();
		etplEngine.compile(template);
		var render = etplEngine.getRenderer('mergeQueue');
		var result = render({
			queue: widgetQueue
		});
		$('#mergeQueueWrap').html(result).unbind()
			.on('click', '._del', function() {
				var _widget = $(this).data('widget');
				if (_widget && widgetQueue.length > 1) {
					$.each(widgetQueue, function(i, e) {
						if (e.widget === _widget) {
							widgetQueue.splice(i, 1);
							return false;
						}
					});
					$(this).parents('li').remove();
				}
			});
	};
	var creatPanel = function(widgetConfig) {
		if (!$.isPlainObject(widgetConfig)) {
			return console.warn('无法创建配置面板！');
		}
		var etplEngine = new etpl.Engine();
		etplEngine.compile(template);
		var render = etplEngine.getRenderer('panel');
		var result = render({
			config: widgetConfig
		});
		//面板事件
		$('#configPanel').html(result).unbind()
			.on('click', '.playTime_mark ._tag', function() {
				//打开面板
				$(this).parents('.playTime_mark').toggleClass('show').siblings().removeClass('show');
				//打开自动生成配置
				if ($(this).parents('.playTime_mark').find('#getConfig').length) {
					$(this).parents('.playTime_mark').find('#getConfig').submit();
				}
			})
			.on('click', '.playTime_mark ._clo', function() {
				//关闭面板
				$(this).parents('.playTime_mark').removeClass('show');
			})
			.on('change', '.form-control', function() {
				//更改配置
				var key = $(this).data('key'),
					val = $(this).attr('type') == 'number' ? +$(this).val() : $(this).val(),
					dataTree = $(this).parents('.section').data('item');
				widgetConfig[dataTree][key].value = val;
				//重绘组件
				paintWidget(widgetQueue, widgetConfig);
			})
			.on('reset', '.panelWrap', function(e) {
				//重置配置
				e.preventDefault();
				initWidget();
			})
			.on('click', '.mergeQueue ._before', function() {
				//前插入
				insertWidget('before');
			})
			.on('click', '.mergeQueue ._after', function() {
				insertWidget('after');
			})
			.on('submit', '#mergeQueue', function(e) {
				//应用合并
				e.preventDefault();
				initWidget();
			})
			.on('submit', '#getConfig', function(e) {
				//生成差异配置
				e.preventDefault();
				var newConfigQueue = [];
				var widgetConfigBack = Storage.get("widgetConfigBack");
				//差异代码
				$.each(widgetConfigBack, function(index, widget) {
					var newConfig = {
						userConfig: {}
					};
					var atomConfig = widget.confBack;
					newConfig.widget = widgetQueue[index].widget;
					for (var key in atomConfig) {
						if (atomConfig.hasOwnProperty(key) && $.isPlainObject(atomConfig[key])) {
							for (var key2 in atomConfig[key]) {
								if (atomConfig[key].hasOwnProperty(key2) && $.isPlainObject(atomConfig[key][key2])) {
									for (var key3 in atomConfig[key][key2]) {
										if (!$.isPlainObject(atomConfig[key][key2][key3]) && !$.isArray(atomConfig[key][key2][key3]) && (atomConfig[key][key2][key3] != widgetConfig[key][key2][key3])) {
											newConfig.userConfig[key] = $.extend({}, newConfig.userConfig[key]);
											newConfig.userConfig[key][key2] = $.extend({}, newConfig.userConfig[key][key2]);
											newConfig.userConfig[key][key2][key3] = widgetConfig[key][key2][key3];
										}
									}
								}
							}
						}
					}
					newConfigQueue.push(newConfig);
				});

				$('#configCodeBox').val(JSON.stringify(newConfigQueue).replace(/^\s+/, ""));
				//发布统计事件
				$('body').trigger('getConfig');
			});
		initCopy();
		//绘制队列
		createQueue(widgetQueue);
		//没有js隐藏按钮
		if (Storage.get("JS") === '') {
			$('#copyJS').hide();
		}
		util.loading.hide();
	};

	module.exports = play;

});