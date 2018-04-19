//css引入(__***css执行配置时会自动加载，不需要再require调用***__)
require_css('css!assets/media/viewer/demo.css');

//执行配置
require.config(DSE.requireConfig);
define('demo', function (require, exports, module) {
    var _viewer = require('viewer');

    //单张图片
    $('.image').viewer();

    //一组图片
    $('.images').viewer();

});
