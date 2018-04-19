//自己扩展的js  如 
//seajs.data.alias.jquery='assets/jquery/jquery-1.9.1.min.js';

dseDefine('page', function(require, exports, module) {
	exports.test = function() {
		//对象引用
		var layer=require("layer");
		layer.msg("hello word");
	};
});

/* ========================程序入口(main)======================== */
var module;//模块对象
seajs.use(['page','jquery','layer','layer_css'], function(m) {
	module=m;
	m.test();
});