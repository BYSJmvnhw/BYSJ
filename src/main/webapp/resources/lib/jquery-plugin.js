/**
 * Created by zqc on 2015/3/13.
 */

define(function(require, exports, module) {

    var $ = require('jquery'); // 引入jq，便于添加jq插件

    $.fn.replaceClass = function (classname1, classname2) {
            var $el = this;
            if ($el.hasClass(classname2)) {
                $el.removeClass(classname2);
                $el.addClass(classname1);
            }
            else {
                $el.error('Class not exist');
            }
            return this;
        };
    exports.$ = $;
});
