/**
 * name: common
 * version: v4.0.0
 * update: 引用responsive插件
 * date: 2016-12-09
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	if(base.browser.ie<8){
		alert('您的浏览器版本过低，请升级或使用chrome、Firefox等高级浏览器！');
		//屏蔽ie78 console未定义错误
		if (typeof console === 'undefined') {
		    console = { log: function() {}, warn: function() {} };
		}
	}
	//返回顶部
	$('body').on('click','.gotop',function(){$('html,body').stop(1).animate({scrollTop:'0'},300);return false;});
	//textarea扩展max-length
	$('textarea[max-length]').on('change blur keyup',function(){
		var _val=$(this).val(),_max=$(this).attr('max-length');
		if(_val.length>_max){
			$(this).val(_val.substr(0,_max));
		}
	});

	//延时显示
	if(base.browser.ie<9){
		$('.opc0').css('filter','unset');
	}else{
		$('.opc0').animate({'opacity':'1'},160);
	}

	// placeholder
	require('placeholder');
	$('input, textarea').placeholder();
	
	var resp = require('responsive');
	//按需渲染
	resp.scanpush();
	//响应图片
	resp.resImg();
	
	/*
	* 输出
	*/
	module.exports = {
		demo:function(){
			var directHash = {
				"0":"重定向",
				"1":"刷新",
				"2":"历史记录"
			};
			console.log('页面来自'+directHash[window.performance.navigation.type]);
		}
	};

	/*
	* 站内公用
	*/
 

	
	
	
});