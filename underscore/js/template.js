define(function (require, exports, module) {
	var $=require('jquery');
	var _=require('underscore');
	var getTemplate={
        initHtml:function(params){
			var _this = this,
			    data = params.data,
			    successFun = params.success;
			params.method = 'GET';
			params.data = {};
			params.success = function (html) {
				if (successFun) {
					if (!data){
					  successFun(html)
					}else{
					  successFun(_.template(html)(data))
					};
				}
			};
			return $.ajax(params);
        }
    }
    module.exports= getTemplate;
});