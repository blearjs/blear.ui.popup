/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Popup = require('../src/index');

var popup = new Popup({
    template: require('./template.html'),
    mask: {
        opacity: 0.2
    }
});

document.getElementById('btn').onclick = function () {
    popup.open();
};
