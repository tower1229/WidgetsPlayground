/**
 * name: util
 * version: v1.0.1
 * update: 潜在的日期排序bug
 * date: 2015-07-03
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	
	//面包屑
	var position = '';

	//随机数
	var random = function(){
		return parseInt(Math.random()*1e6)
	}
	//获取日期
	var getDate = function(){
		var myDate = new Date();
		return myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
	}

	//存储
	var Storage = {
		prefix: 'WDP-',
		support:function(){
			return localStorage
		},
		set:function(key,val){
			if(this.support){
				if($.isPlainObject(val) || $.isArray(val)){
					val = JSON.stringify(val);
				};
				key = this.prefix + key;
				localStorage.setItem(key,val);
			}
		},
		get:function(key){
			if(this.support){
				key = this.prefix + key;
				if(localStorage.getItem(key) && (localStorage.getItem(key).match(/^\[(.*){1,}$/) || localStorage.getItem(key).match(/^\{(.+:.+,*){1,}\}$/))){
					return JSON.parse(localStorage.getItem(key));
				};
				return localStorage.getItem(key);
			}
		},
		remove:function(key){
			if(this.support){
				key = this.prefix + key;
				localStorage.removeItem(key);
			}
		},
		clear:function(){
			if(this.support){
				var prefix = this.prefix;
				for(var item in localStorage){
					if(item.indexOf(prefix)>-1 && item.indexOf('userInfo')<0){
						localStorage.removeItem(item);
					}
				}
			}
		}
	}
	//栏目状态管理
	var jrChannel = {
		support: function(){
			return window.sessionStorage
		},
		get:function(){
			if(this.support){
				return window.sessionStorage.jrChannel ? 
					(window.sessionStorage.jrChannel).split('^') : false;
			}
		},
		set:function(val){
			window.sessionStorage.jrChannel = val.join('^');
		}
	};
	var loadingHTML = '<div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div>';
	//模板渲染
	var etpl = require('etpl');
	var tpl = function(target,data,cb){
		var etplEngine = new etpl.Engine();
		var template;
		var loadStart = new Date();
		var loadInterval = 500;
		var loadTime = 0;
		
		if(Storage.get('template')){
			template = Storage.get('template');
		}else{
			$.ajax({
				url: seajs.root + '/ui/temp/temp.htm',
				dataType:'html',
				cache:false,
				async:false,
				success:function(res){
					template = res;
					Storage.set('template',res);
				},
				error:function(){
					console.warn('加载模板出错')
				}
			})
		};

		etplEngine.compile(template)
		var Render = etplEngine.getRenderer( target );
		var Html = Render(data);
		
		if(target==="widgetList" || target==="selectWidget"){
			$('#'+target).html(loadingHTML);
			loadTime = (new Date()).getTime() - loadStart.getTime();
		}else{
			loadTime = loadInterval;
		}
		setTimeout(function(){
			$('#'+target).html(Html);
			if(typeof(cb)==='function') {
				cb()
			}else{
				console.log(target+'渲染成功');
			};
		},loadInterval - loadTime)

	}
	/*
	* 组件排序
	* @_widgets 组件数组
	*/
	var sort  = function(_widgets){
		var type = rootBy;
		//按日期排序
		var bydate = function(a,b){
			var dateToNum = function(dataType){
				var _num = 0,
					_array = dataType.split('-');
				if(_array.length===3){
					_num+=parseInt(_array[0])*10000;
					_num+=parseInt(_array[1])*100;
					_num+=parseInt(_array[2]);
				}
				return _num;
			};
			
			return dateToNum(b.date) - dateToNum(a.date);

		}
		//按名称排序
		var byname = function(a,b){
			return a.title.localeCompare(b.title);
		}

		//排序
		switch(type){
			case "bydate":
				_widgets.sort(bydate);
				break;
			default:
				_widgets.sort(byname);
		}

	}
	/*
	* 去重添加到目标数组
	* @ele 添加的元素
	* @target 目标数组
	* @by 匹配键
	*/
	var addResult = function(ele,target,by){
		var only = true;
		for(var i=0;i<target.length;i++){
			if(by){
				if(target[i][by]==ele[by]){
					only = false;
					return
				}
			}else{
				if(target[i]==ele){
					only = false;
					return
				}
			}
		}
		only && target.push(ele);
	}
	/*获取数组数据
	* @array 所有组件数组
	* @num 条数限制
	* @keywords 关键词
	*/
	var getWidgets = function(array,num,keywords){
		var _widgets = [];
		var each = function(eachArray){
			for(var i = 0;i<eachArray.length;i++){
				if(eachArray[i].list && eachArray[i].list.length){
					var newArray = eachArray[i].list;
					each(newArray);
				}
				if(eachArray[i].widget){
					_widgets.push(eachArray[i]);
				}
			}
		};
		//得到所有组件
		each(array);
		
		//搜索
		if(keywords){
			//by title>widget>tag>author
			var search = [];
			
			//title完全匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].title===keywords){
					addResult(_widgets[i],search,'widget');
				}
			}
			//widget完全匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].widget===keywords){
					addResult(_widgets[i],search,'widget');
				}
			}
			//title包含匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].title.indexOf(keywords)>-1){
					addResult(_widgets[i],search,'widget');
				}
			}
			//widget包含匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].widget.indexOf(keywords)>-1){
					addResult(_widgets[i],search,'widget');
				}
			}
			//tag匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].tag.indexOf(keywords)>-1){
					addResult(_widgets[i],search,'widget');
				}
			}
			//author匹配
			for(var i=0;i<_widgets.length;i++){
				if(_widgets[i].author.indexOf(keywords)>-1){
					addResult(_widgets[i],search,'widget');
				}
			}

			_widgets = search;
		}

		//限制条数
		if(num!==0 && _widgets.length>num){
			_widgets = _widgets.slice(0,num);			
		}
		//扩展数据 
		for(var i=0;i<_widgets.length;i++){
			var widgetInfo = _widgets[i].widget.split('-'),
				widgetPath = widgetRootPath+widgetInfo[0]+'/';
			if(widgetInfo.length===2){
				widgetPath+=(widgetInfo[1]+'/');
			}
			for(var x in widgetExt){
				_widgets[i][x] = widgetPath+widgetExt[x]
			}
		}

		//排序
		sort(_widgets);
		// 缓存
		Storage.set('showingWidgets',{widgets:_widgets})
		return {widgets:_widgets};
	}
	//显示当前栏目组件
	var showWidgets = function(){
		var _widgets = [];
		var array = Storage.get('widgetData').widgets;
		var channelName = position = "首页";
		if($('.sub-nav-'+(jrChannel.get()[0])+'-'+jrChannel.get()[1]).length){
			channelName = $('.sub-nav-'+(jrChannel.get()[0])+'-'+jrChannel.get()[1]).text();
		};
		//缩小数据范围
		(function(){
			if(channelName!=='首页'){
				var _mainChannelName = $('.main-nav-'+jrChannel.get()[0]).children('span').text();
				position = _mainChannelName+' / '+channelName;
				for(var i=0;i<array.length;i++){
					if(_mainChannelName.indexOf(array[i].title)>-1){
						var _subArray = array[i].list;
						for(var u=0;u<_subArray.length;u++){
							if(channelName.indexOf(_subArray[u].title)>-1){
								array = _subArray[u].list;
								return;
							}
						}
						return;
					}
				};
			}
		})();

		if(channelName==='首页'){
			//首页获取最新20个组件
			rootBy = 'bydate';
			_widgets = getWidgets(array,0);
		}else{
			rootBy = 'bytitle';
			_widgets = getWidgets(array,0);
		}

		mainTemp(_widgets);
		
	}
	//筛选
	var filter = function(){
		//初始化排序
		$('#sortWrap').find('.btn').each(function(i,e){
			if($(e).data('val')==rootBy){
				$(e).addClass('active').siblings().removeClass('active');
				return;
			}
		})
		//初始化标签
		for(var i=0;i<filterTag.length;i++){
			$('#tagWrap').find('.btn').each(function(i,e){
				if($(e).text()==filterTag[i]){
					$(e).addClass('active');
				}
			})
		}
		//排序事件
		if(!$('#sortWrap').data('init')){
			//清除过滤历史
			Storage.remove('showingTagWidgets');

			$('#sortWrap').on('click','.btn',function(e){
				e.preventDefault();
				rootBy = $(this).data('val');
				$(this).addClass('active').siblings().removeClass('active');
				var _widgets = Storage.get('showingTagWidgets') ? Storage.get('showingTagWidgets').widgets : Storage.get('showingWidgets').widgets;
				sort(_widgets);
				tpl('widgetList',{widgets:_widgets});
			}).data('init',1)
		};
		//标签事件
		if (!$('#tagWrap').data('init')) {
			$('#tagWrap').on('click', '.btn', function(e) {
				e.preventDefault();
				var showingWidgets = Storage.get('showingWidgets').widgets;
				var tagResult = [];
				var activeClass='btn-info';
				if ($(this).hasClass('chooseAll')) {
					// 全选
					$(this).addClass(activeClass).siblings().removeClass(activeClass);
					filterTag = [];
					tagResult = showingWidgets;
				} else {
					$(this).toggleClass(activeClass);
					if (!$('#tagWrap').find('.'+activeClass).length) {
						// 全去掉
						filterTag = [];
						tagResult = showingWidgets;
					} else {
						//筛选
						var showTag = [];
						$('#tagWrap').find('.chooseAll').removeClass(activeClass);
						$('#tagWrap').find('.btn').each(function(i, e) {
							if ($(e).hasClass(activeClass)) {
								showTag.push($(e).text());
							}
						});
						//console.log(showTag)
						for (var i = 0; i < showTag.length; i++) {
							for(var u=0;u<showingWidgets.length;u++){
								if(showingWidgets[u].tag.indexOf(showTag[i]) > -1){
									tagResult.push(showingWidgets[u]);
								}
							}
						}
					}
				};
				//渲染结果
				Storage.set('showingTagWidgets',{widgets:tagResult});
				tpl('widgetList',{widgets:tagResult});
				setTimeout(function() {
					$('body,html').scrollTop($('#filter').offset().top);
				}, 0)
			}).data('init', 1)
		}
	};

	//提取组件标签
	var getTag = function(widgetArray){
		var tag = [];
		for(var i=0;i<widgetArray.length;i++){
			if(widgetArray[i].tag && $.trim(widgetArray[i].tag)!=''){
				var thisTag = widgetArray[i].tag.split('/');
				for(var u=0;u<thisTag.length;u++){
					addResult($.trim(thisTag[u]),tag);
				}
			}
			
		}
		return {
			tags:tag,
			posi:position
		};
	};
	
	// 渲染页面
	var mainTemp = function(data){
		if($('#selectWidget').length){
			tpl('selectWidget',data);
		}else if(!window.playing){
			tpl('filter',getTag(data.widgets),filter);
			tpl('widgetList',data);
		}
	};
	//loading
	var loading = {
		html: $('<div class="globalMask" id="globalMask"></div>').append(loadingHTML),
		show:function(){
			if(!$('#globalMask').length){
				$('body').append(this.html);
			};
			$('#globalMask').addClass('show');
		},
		hide:function(){
			$('#globalMask').removeClass('show');
		}
	};

	/*
	* 输出
	*/
	module.exports = {
		tpl:tpl,
		sort:sort,
		getWidgets:getWidgets,
		showWidgets:showWidgets,
		Storage:Storage,
		jrChannel:jrChannel,
		random:random,
		getTag:getTag,
		mainTemp:mainTemp,
		etpl:etpl,
		getDate:getDate,
		loading:loading
	}

	
})