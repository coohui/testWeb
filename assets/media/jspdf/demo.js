//css引入(__***css执行配置时会自动加载，不需要再require调用***__)
require_css('css!assets/media/jspdf/demo.css');

//执行配置
require.config(DSE.requireConfig);
define('demo', function (require, exports, module) {
    var _jspdf = require('jspdf');

    var url = $.getParam('url') || 'test.pdf';
    $('a.media').attr('href', url).media({width: $('body').width(), height: $('body').height()});

});
