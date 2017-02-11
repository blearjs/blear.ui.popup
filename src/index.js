/**
 * 弹出框
 * @author ydr.me
 * @create 2016-04-28 18:07
 */



'use strict';

var UI = require('blear.ui');
var Window = require('blear.ui.window');
var Mask = require('blear.ui.mask');
var Animation = require('blear.classes.animation');
var layout = require('blear.core.layout');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var typeis = require('blear.utils.typeis');

var namespace = UI.UI_CLASS + '-popup';
var AUTO = 'auto';
var defaults = object.assign(true, {}, Window.defaults, {
    /**
     * 弹出的元素
     * @type HTMLElement|String|null
     */
    el: null,

    /**
     * 模板
     * @type String|null
     */
    template: null,

    /**
     * 遮罩配置，如果为 false，则不显示遮罩
     * @type Object|null|Boolean
     */
    maskOptions: {},

    /**
     * 宽度
     * @type Number|String
     */
    width: 'auto',

    /**
     * 高度
     * @type Number|String
     */
    height: 'auto',

    /**
     * 最小宽度
     * @type Number|String
     */
    minWidth: '100%',

    /**
     * 最小高度
     * @type Number|String
     */
    minHeight: 'none',

    /**
     * 最大宽度
     * @type Number|String
     */
    maxWidth: '100%',

    /**
     * 最大高度
     * @type Number|String
     */
    maxHeight: '100%',

    /**
     * 上位移
     * @type Number|String
     */
    top: 'auto',

    /**
     * 右位移
     * @type Number|String
     */
    right: 0,

    /**
     * 下位移
     * @type Number|String
     */
    bottom: 0,

    /**
     * 左位移
     * @type Number|String
     */
    left: 0,
    openAnimation: function (to, done) {
        var the = this;
        var el = the.getWindowEl();
        var an = new Animation(el, the.getOptions('animationOptions'));

        attribute.style(el, {
            display: 'block',
            transform: {
                translateY: '100%'
            }
        });

        to.transform = {
            translateY: 0
        };
        an.transit(to, {
            duration: 234,
            easing: 'in-out'
        });
        an.start(function () {
            an.destroy();
            done();
        });
    },
    closeAnimation: function (to, done) {
        var the = this;
        var el = the.getWindowEl();
        var an = new Animation(el, the.getOptions('animationOptions'));

        attribute.style(el, {
            display: 'block',
            transform: {
                translateY: 0
            }
        });

        to.transform = {
            translateY: '100%'
        };
        an.transit(to, {
            duration: 234,
            easing: 'in-out'
        });
        an.start(function () {
            an.destroy();
            done();
        });
    }
});
var Popup = Window.extend({
    className: 'Popup',
    constructor: function (options) {
        var the = this;

        the[_options] = options = object.assign(true, {}, defaults, options);
        Popup.parent(the, {
            minWidth: options.minWidth,
            minHeight: options.minHeight,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            width: options.width,
            height: options.height,
            topRate: AUTO,
            leftRate: AUTO,
            openAnimation: options.openAnimation,
            closeAnimation: options.closeAnimation,
            addClass: options.addClass + ' ' + namespace + '-window'
        });

        the[_initNode]();
        the[_initEvent]();
    },

    /**
     * 获取配置
     * @param key
     * @returns {*}
     */
    getOptions: function (key) {
        return UI.getOptions(this, _options, key);
    },

    /**
     * 获取配置
     * @param key
     * @param val
     * @returns {*}
     */
    setOptions: function (key, val) {
        return UI.setOptions(this, _options, key, val);
    },

    /**
     * 设置 HTML
     * @param html {String|Node}
     * @returns {HTMLElement}
     */
    setHTML: function (html) {
        var the = this;

        if (typeis.String(html)) {
            attribute.html(the[_containerEl], html);
        } else if (html && html.nodeType) {
            modification.empty(the[_containerEl]);
            modification.insert(html, the[_containerEl]);
        }

        Popup.superInvoke('update', the);
        return selector.children(the[_containerEl])[0];
    },


    /**
     * 获取 popup 元素
     * @returns {*}
     */
    getPopupEl: function () {
        return this[_containerEl];
    },


    /**
     * 销毁实例
     */
    destroy: function (callback) {
        var the = this;

        callback = fun.ensure(callback);
        callback = fun.bind(callback, the);
        Popup.superInvoke('destroy', the, function () {
            if (the[_mask]) {
                the[_mask].destroy(callback);
            }
        });
    }
});
var _mask = Popup.sole();
var _options = Popup.sole();
var _containerEl = Popup.sole();
var _initNode = Popup.sole();
var _initEvent = Popup.sole();
var pro = Popup.prototype;


/**
 * 初始化节点
 */
pro[_initNode] = function () {
    var the = this;
    var options = the[_options];
    var containerEl = the[_containerEl] = modification.create('div', {
        'class': namespace
    });
    var el = null;

    if (options.el) {
        el = selector.query(options.el)[0];
    }

    if (el && options.template) {
        attribute.html(el, options.template);
    } else if (!el) {
        el = modification.parse(options.template || '<div/>');
    }

    modification.insert(el, containerEl);
    Popup.superInvoke('setHTML', the, containerEl);
};


/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    if (options.maskOptions === false) {
        return;
    }

    the[_mask] = new Mask(options.maskOptions);
    the.on('beforeOpen', function (to) {
        the[_mask].zIndex(UI.zIndex()).open();
        to.top = options.top;
        to.right = options.right;
        to.bottom = options.bottom;
        to.left = options.left;
        attribute.style(the[_containerEl], {
            height: to.height,
            overflowScrolling: 'touch'
        });
    });
    the.on('afterClose', function () {
        the[_mask].close();
    });
    the[_mask].on('hit', function () {
        the.close();
    });
};

require('./style.css', 'css|style');
Popup.defaults = defaults;
module.exports = Popup;
