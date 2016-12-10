/**
 * index
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	var com = require('./common');
	var util = require('./util');
	base.ajaxSetup($);
	require('box');

	var etpl = util.etpl;
	var Storage = util.Storage;
	//组件存放路径
	window.widgetRootPath = seajs.root + '/widget/';
	//初始排序
	window.rootBy = 'bytitle';	//'bydate'
	//初始标签
	window.filterTag = [];
	//组件扩展数据
	window.widgetExt = {
		temp 		: 'temp.htm',
		css 		: 'style.css',
		script 		: 'script.js',
		album 		: 'album.jpg',
		config 		: 'config.json'
	};
	//初始栏目
	if(!util.jrChannel.get()){
		util.jrChannel.set([0,0]);
	}
	
	//导航
	var nav = function(){
		var navSync;
		$('.main-nav').on('mouseenter', 'li', function() {
			var _index = $(this).index();
			clearTimeout(navSync);
			if($('.sub-nav-'+_index).length){
				$('.sub-nav').addClass('show').find('.sub-nav-'+_index).show()
				.siblings().hide();
			}else{
				$('.sub-nav').removeClass('show');
			}
		}).on('mouseleave','li',function(e){
			navSync = setTimeout(function() {
				$('.sub-nav').removeClass('show');
			}, 160);
		}).on('click','li',function(){
			if(!$(this).index()){
				//首页
				util.jrChannel.set([0,0]);
				getChannel();
				$('body,html').stop().animate({scrollTop:0},320);
				$('.welcome').show();
			}
		});

		$('.sub-nav').on('mouseenter', function() {
			clearTimeout(navSync);
		}).on('mouseleave', function() {
			navSync = setTimeout($.proxy(function() {
				$(this).removeClass('show');
			}, this), 160);
		}).on('click','li',function(){
			var newChannel = [];
			newChannel[1] = $(this).index();
			newChannel[0] = $(this).attr('class').split('-')[2];
			util.jrChannel.set(newChannel);
			getChannel();
			$('body,html').stop().animate({scrollTop:0},320);
			$('.welcome').hide();
		});
		getChannel();
	};
	//定位栏目
	var getChannel = function(bysearch){	
		$('.main-nav-'+util.jrChannel.get()[0]).addClass('cur').siblings().removeClass('cur');
		$('.sub-nav').find('.cur').removeClass('cur');

		if($('.sub-nav-'+(util.jrChannel.get()[0])+'-'+util.jrChannel.get()[1]).length){
			$('.sub-nav-'+(util.jrChannel.get()[0])+'-'+util.jrChannel.get()[1]).addClass('cur')
			.siblings().removeClass('cur');
		}

		if(!bysearch){
			util.showWidgets();
		}	
	};

	//启动
	var init = function(){
		$.ajax({
			url: seajs.root + "/widget/data.json",
			cache:false,
			dataType:"json",
			success:function(res){
				var widgetsObj = {};
				widgetsObj.widgets = res.widgets;
				//在线升级
				if(!Storage.get('version')){
					Storage.clear();
					init();
				}else if((Storage.get('version')!==res.version.value)){
					$.box.alert(res.version.description, function(){
						Storage.clear();
						init();
					}, {
						title:"即将升级到"+res.version.value,
						oktext: "立即升级",
						bgclose:false,
						btnclose:false
					});
				};
				Storage.set('version', res.version.value);
				//存储组件信息
				Storage.set('widgetData',widgetsObj);
				//生成导航
				var allwidgetsnum = 0;
				for(var i=0;i<res.widgets.length;i++){
					if(res.widgets[i].list){
						var list2 = res.widgets[i].list,
							channelwidgetsnum = 0;
						for(var o=0;o<list2.length;o++){
							if(list2[o].list){
								channelwidgetsnum+=list2[o].list.length;
							}
						}
						res.widgets[i]['nums'] = channelwidgetsnum;
						allwidgetsnum+=channelwidgetsnum;
					}
				}
				for(var i=0;i<res.widgets.length;i++){
					if(res.widgets[i].title==='首页'){
						res.widgets[i]['nums'] = allwidgetsnum;
						break;
					}
				};

				util.tpl('nav',res,nav);
				
			}
		});
	};
	
	//start 
	init();

	//首屏滚动
	var filHeight = $('.mainCont').offset().top-50;
	require('mousewheel');
	$('.welcome').on('mousewheel',function(event){
		if(event.deltaY<0){
			$('body,html').stop(1).animate({scrollTop:filHeight},320);
		}else{
			$('body,html').stop(1).animate({scrollTop:0},320);
		}

	});

	//搜索
	var searchThro = base.throttle(function(){
		console.log('searchThro')
		util.jrChannel.set([0,0]);
		getChannel('bysearch');
		var keywords = $('#globalSearch').val();
		var array = Storage.get('widgetData').widgets;
		var _widgets = util.getWidgets(array,0,keywords);
		util.mainTemp(_widgets);
	},600,1000);
	$('#globalSearch')
	.on('keypress',searchThro)
	.on('focus',function(){
		$(this).val('').parent('.search').addClass('focus');
		$('body,html').stop(1).animate({scrollTop:filHeight},320);
	})
	.on('blur',function(){
		$(this).parent('.search').removeClass('focus');
	});
	//快捷键
	require('mousetrap');
	Mousetrap.bind('ctrl+f', function(e) {
		if (e.preventDefault) {
	        e.preventDefault();
	    } else {
	        e.returnValue = false;
	    }
     	$('#globalSearch').trigger('focus');
    });
    
	//弹出演示界面
	var getWidgetByName = function(name){
		var sw = Storage.get('showingWidgets').widgets;
		var i=0;
		var len = sw.length;
		for(;i<len;i++){
			if(sw[i].widget==name){
				return sw[i];
			}
		}
		return null;
	};
	$('#widgetList').on('click','li',function(){
		var that = $(this);
		require.async('./play',function(play){
			play([getWidgetByName(that.data('name'))]);
		})
	});

	//通过代码呼出组件
	$('#quickStart').on('submit',function(e){
		e.preventDefault();
		if($.trim($('#configCode').val())!='' && $.trim($('#configCode').val()).match(/^\[(.+:.+,*){1,}\]$/)){
			var newWidget = JSON.parse($('#configCode').val());
			//console.log(newWidget)
			var widgetArray = [];
			var compConfig = {};
			$.each(newWidget,function(i,e){
				if($.isPlainObject(e)){
					if(e['userConfig']){
						$.extend(compConfig,e.userConfig)
					}
					if(e['widget']){
						widgetArray.push(getWidgetByName(e.widget));
					}
				}
			});	
			require.async('./play',function(play){		
				play(widgetArray,compConfig);
			})
		}else{
			$('#configCode').empty().focus();
		}
	});

	//数据统计
	require.async('./count',function(init){
		init();
	});

	//Bing壁纸
	//https://jsonp.afeld.me/?callback=?&url=http%3A%2F%2Fcn.bing.com%2FHPImageArchive.aspx%3Fformat%3Djs%26idx%3D0%26n%3D1
	$.getJSON("http://lab.dobyi.com/api/bing.php", function(data){
	    var bing = data.url;
	    $('body').css('background-image','url('+bing+')');
	});

	module.exports = {
		init:init
	};
});