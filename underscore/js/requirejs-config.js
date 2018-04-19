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
window.CLIENT_PATH=getBaseURL();
// 基础配置
window.requireConfig = {
    "baseUrl": window.CLIENT_PATH,
    "paths": {
		"jquery" : "assets/jquery/jquery-1.9.1",/* jquery */
		"layer" : "assets/layer/layer",/*layer弹窗*/
		"underscore": "assets/underscore/underscore-min",/*underscore模板*/
    },
    "shim": {
        "layer": {
            "deps": ["jquery"]
        }
    }
};
function require_js(name, url, deps) {
    window.requireConfig["paths"][name] = url;
    if (deps) {
        window.requireConfig["shim"][name] = {
            "deps": deps
        };
    }
}
//依赖前置，引用某个JS的时候把另一个提前引用一下
function require_shim(name, deps) {
    if (!window.requireConfig["shim"][name]) {
        window.requireConfig["shim"][name] = {
            "deps": deps
        };
    } else {
        window.requireConfig["shim"][name]["deps"] = window.requireConfig["shim"][name]["deps"].concat(deps);
    }
}
//服务端地址
window._serverPath="http://xxx.xxx.xx.xx:xxxx";
