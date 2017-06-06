/**
 * name: common
 * version: v4.1.2
 * update: placeholder inline
 * date: 2017-05-11
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var base = require('base');
	if (base.browser.ie < 8) {
		alert('您的浏览器版本过低，请升级或使用chrome、Firefox等高级浏览器！');
		//屏蔽ie78 console未定义错误
		if (typeof console === 'undefined') {
			console = {
				log: function() {},
				warn: function() {}
			};
		}
	}
	//返回顶部
	$('body').on('click', '.gotop', function() {
		$('html,body').stop(1).animate({
			scrollTop: '0'
		}, 300);
		return false;
	});
	//textarea扩展max-length
	$('textarea[max-length]').on('change blur keyup', function() {
		var _val = $(this).val(),
			_max = $(this).attr('max-length');
		if (_val.length > _max) {
			$(this).val(_val.substr(0, _max));
		}
	});

	//延时显示
	if (base.browser.ie < 9) {
		$('.opc0').css('filter', 'unset');
	} else {
		$('.opc0').animate({
			'opacity': '1'
		}, 160);
	}

	// placeholder
	(function(){var isOperaMini=Object.prototype.toString.call(window.operamini)=='[object OperaMini]';var isInputSupported='placeholder'in document.createElement('input')&&!isOperaMini;var isTextareaSupported='placeholder'in document.createElement('textarea')&&!isOperaMini;var valHooks=$.valHooks;var propHooks=$.propHooks;var hooks;var placeholder;if(isInputSupported&&isTextareaSupported){placeholder=$.fn.placeholder=function(){return this};placeholder.input=placeholder.textarea=true}else{var settings={};placeholder=$.fn.placeholder=function(options){var defaults={customClass:'placeholder'};settings=$.extend({},defaults,options);var $this=this;$this.filter((isInputSupported?'textarea':':input')+'[placeholder]').not('.'+settings.customClass).bind({'focus.placeholder':clearPlaceholder,'blur.placeholder':setPlaceholder}).data('placeholder-enabled',true).trigger('blur.placeholder');return $this};placeholder.input=isInputSupported;placeholder.textarea=isTextareaSupported;hooks={'get':function(element){var $element=$(element);var $passwordInput=$element.data('placeholder-password');if($passwordInput){return $passwordInput[0].value}return $element.data('placeholder-enabled')&&$element.hasClass(settings.customClass)?'':element.value},'set':function(element,value){var $element=$(element);var $passwordInput=$element.data('placeholder-password');if($passwordInput){return $passwordInput[0].value=value}if(!$element.data('placeholder-enabled')){return element.value=value}if(value===''){element.value=value;if(element!=safeActiveElement()){setPlaceholder.call(element)}}else if($element.hasClass(settings.customClass)){clearPlaceholder.call(element,true,value)||(element.value=value)}else{element.value=value}return $element}};if(!isInputSupported){valHooks.input=hooks;propHooks.value=hooks}if(!isTextareaSupported){valHooks.textarea=hooks;propHooks.value=hooks}$(function(){$(document).delegate('form','submit.placeholder',function(){var $inputs=$('.'+settings.customClass,this).each(clearPlaceholder);setTimeout(function(){$inputs.each(setPlaceholder)},10)})});$(window).bind('beforeunload.placeholder',function(){$('.'+settings.customClass).each(function(){this.value=''})})}function args(elem){var newAttrs={};var rinlinejQuery=/^jQuery\d+$/;$.each(elem.attributes,function(i,attr){if(attr.specified&&!rinlinejQuery.test(attr.name)){newAttrs[attr.name]=attr.value}});return newAttrs}function clearPlaceholder(event,value){var input=this;var $input=$(input);if(input.value==$input.attr('placeholder')&&$input.hasClass(settings.customClass)){if($input.data('placeholder-password')){$input=$input.hide().nextAll('input[type="password"]:first').show().attr('id',$input.removeAttr('id').data('placeholder-id'));if(event===true){return $input[0].value=value}$input.focus()}else{input.value='';$input.removeClass(settings.customClass);input==safeActiveElement()&&input.select()}}}function setPlaceholder(){var $replacement;var input=this;var $input=$(input);var id=this.id;if(input.value===''){if(input.type==='password'){if(!$input.data('placeholder-textinput')){try{$replacement=$input.clone().attr({'type':'text'})}catch(e){$replacement=$('<input>').attr($.extend(args(this),{'type':'text'}))}$replacement.removeAttr('name').data({'placeholder-password':$input,'placeholder-id':id}).bind('focus.placeholder',clearPlaceholder);$input.data({'placeholder-textinput':$replacement,'placeholder-id':id}).before($replacement)}$input=$input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id',id).show()}$input.addClass(settings.customClass);$input[0].value=$input.attr('placeholder')}else{$input.removeClass(settings.customClass)}}function safeActiveElement(){try{return document.activeElement}catch(exception){}}})();
	$('input, textarea').placeholder();


	/*
	 * 输出
	 */
	module.exports = {
		demo: function() {
			var directHash = {
				"0": "重定向",
				"1": "刷新",
				"2": "历史记录"
			};
			console.log('页面来自' + directHash[window.performance.navigation.type]);
		}
	};

	/*
	 * 站内公用
	 */



});