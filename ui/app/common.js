/**
 * name: common
 * version: v2.0.1
 * update: 去掉count模块和环境变量
 * date: 2015-07-07
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	var resp = require('responsive');
	var typeCatch = resp.getType();

	if(base.browser.ie==6){
		alert('本站不支持IE6访问，请升级IE或使用chrome、Firefox等高级浏览器！');
	}

	//pc模拟多终端检测
	if(window.sessionStorage && sessionStorage.getItem('PcMode')){
		$('body').addClass('PcMode');
		typeCatch = resp.getType();
	}
	(function() { 
		if( window.sessionStorage && sessionStorage.getItem('browserRedirectLock') ) return;
	    if(!base.browser.isMobile && typeCatch!=='Pc'){
	    	require.async('box',function(){
	    		$.box.confirm('网站即将进入移动模式，点【取消】保持电脑模式', function(){
	    			window.sessionStorage && sessionStorage.setItem('browserRedirectLock','true'); 
	    			$.box.hide();
	    		},function(){
	    			typeCatch = 'Pc';
	    			window.sessionStorage && sessionStorage.setItem('PcMode','Pc'); 
	    		},{
	    			title: "切换到移动模式"
	    		})
	    	})
	    }
	})();
	
	//跨屏刷新
	var throttleResize = base.throttle(function(){
			if(resp.getType()!==typeCatch) document.location.reload();
		});
	$(window).on('resize',function(){
		throttleResize();
	});

	/*
	* 常用工具
	*/
	//返回顶部
	$('body').on('click','.gotop',function(){$('html,body').stop(1).animate({scrollTop:'0'},300);return false});
	//关闭当前页
	$('body').on('click','.closewin',function(){window.opener=null;window.open("","_self");window.close()});
	//打印当前页
	$('body').on('click','.print',function(){window.print()});
	//加入收藏
	$('body').on('click','.favorite',function(){var sURL = "http:&#47;&#47;"+document.domain+"&#47;",sTitle = document.title;try{window.external.addFavorite(sURL, sTitle)} catch (e){try{window.sidebar.addPanel(sTitle, sURL, "")}catch (e){alert("加入收藏失败，请使用Ctrl+D进行添加")}}});
	//设为首页
	$('body').on('click','.sethome',function(){var vrl="http:&#47;&#47;"+document.domain+"&#47;";if(window.netscape){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")}catch(e){alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。")}var prefs=Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);prefs.setCharPref('browser.startup.homepage',vrl)}else{alert("您的浏览器不支持自动设为首页，请您手动进行设置！")}});
	//屏蔽ie78 console未定义错误
	if (typeof console === 'undefined') {
	    console = { log: function() {}, warn: function() {} }
	}
	//textarea扩展max-length
	$('textarea[max-length]').on('change blur keyup',function(){
		var _val=$(this).val(),_max=$(this).attr('max-length');
		if(_val.length>_max){
			$(this).val(_val.substr(0,_max));
		};
	})
	//延时显示
	$('.opc0').animate({'opacity':'1'},160);
	
	//按需渲染
	resp.scanpush();
	//响应图片
	resp.resImg();
	/*
	* 输出
	*/
	module.exports = {
		demo:function(){
			console.log('hello '+resp.getType());
		}
	};

	/*
	* 站内公用
	*/
 
	//导航当前状态
	//var jrChannelArr=jrChannel.split('#');
	//$('.nav').children('li').eq(jrChannelArr[0]).addClass('cur').find('li').eq(jrChannelArr[1]).addClass('cur');
	
	
	
	
});