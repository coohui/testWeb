require_js('Config', 'require/js/config');
//执行配置
require.config(window.requireConfig);
define('index',function(require,exports,module){
	var $=require('jquery');
    var layer=require('layer');
    var Config = require('Config');
    layer.config({
        path: window._baseUrl + 'assets/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    var layerIndex = null;
    var Page={
    	init:function(){
            layer.alert(Config.a);
    	}
    };

	$(function() {//程序入口
		Page.init();
	});
    window.Config = Config;//把常量提供到页面上
});
