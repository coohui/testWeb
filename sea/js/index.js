seajs.data.alias.Config= window._baseUrl + 'sea/js/config.js';/*自己的业务代码需手动引入一下*/
define('../js/index',function(require,exports,module){
	var $=require('jquery');
    var layer=require('layer');
	var viewer = require('viewer');
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
    module.exports.Config = Config;//把常量提供到页面上
});
/*程序入口*/
var Config=null;
seajs.use(['../js/index'],function(module){
    Config = module.Config;
});