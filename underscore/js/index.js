require_js('Config', 'underscore/js/config');
require_js('template', 'underscore/js/template');
//执行配置
require.config(window.requireConfig);
define('index',function(require,exports,module){
	var $=require('jquery');
    var layer=require('layer');
    var Config = require('Config');
    var template = require('template');

    layer.config({
        path: window._baseUrl + 'assets/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });
    var layerIndex = null;
    var Page={
    	init:function(){
            var params = {
               data : {datas:Config.data},
               url:window._baseUrl +'underscore/template/temp1.html', 
               success : function(data){
                   $('#temp').html(data);
                   setTimeout(function(){
                      layer.msg('加载完成！');
                   },500);
               }
            };
            template.initHtml(params);
    	}
    };

	$(function() {//程序入口
        $('#btn').click(function(){
            Page.init();
        })
	});
});
