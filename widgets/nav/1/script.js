var resp = require('responsive');
//扫描按需加载
resp.scanpush();

//nav
var _li = $('#menu').children('ul').children('li');
if(resp.getType()!=='Mobile'){
	_li.each(function(i,e){
		i = i+1;
		$(this).addClass('nav'+i);
	});
	$('#menu').children('ul').find('li:last-child').addClass('last');
	_li.mouseenter(function(){
		$(this).addClass('hover');
	}).mouseleave(function(){
		$(this).removeClass('hover');
	});
}else{
	_li.each(function(i,e) {
        $(this).children('a').after($(this).find('ul'));
		$(this).find('._layer').remove();
    });
	require('offcanvas');
	$('.widget-nav').offcanvas();
}
