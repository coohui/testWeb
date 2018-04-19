// 获取基础路径
function getBaseURL() {
	if (!window._baseUrl) {
		var local = window.location;
		var contextPath = local.pathname.split("/")[1];
		//window._baseUrl = local.protocol + "//" + local.host + "/" + contextPath + "/";//加项目名：如http://localhost:8080/pro
		window._baseUrl = local.protocol + "//" + local.host + "/";//不加项目名：如http://localhost:8080
	}
	return window._baseUrl;
};
// 基础配置
seajs.config({
	base : getBaseURL(),
	alias : {/* 第三方依赖 */
		"jquery" : "assets/jquery/jquery-1.9.1.js",/* jquery */
		"layer" : "assets/layer/layer.js",/*layer弹窗*/
		"underscore": "assets/lodash/underscore-min.js",/*underscore模板*/
		"viewer": "assets/media/viewer/js/viewer.min.js",/*viewer*/
	}
});
//服务端地址
window._serverPath="http://xxxx";
