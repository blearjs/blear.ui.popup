/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';

var Popup = require('../src/index');

var popup = new Popup({
    template: require('./template.html'),
    maskOptions: {
        opacity: 0.9
    },
    maskThrough: true
});

document.getElementById('btn').onclick = function () {
    popup.open();
};

document.getElementById('btn2').onclick = function () {
    alert('btn2');
};

document.addEventListener('click', function (ev) {
    console.log(ev);
});
