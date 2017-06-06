//扫描按需加载
var resp = require('responsive');
resp.scanpush();
//百度分享
require.async('bdshare', function(bs) {
	bs([{
		tag: 'share_${id}',
		bdSize: ${shareSize.value},
		bdStyle: ${shareType.value}
	}]);
})