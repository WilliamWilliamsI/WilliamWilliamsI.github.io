
!(function (win) {
    "use strict";

    var DoDo = function () { };

    /**
    * 选择器
    * @param {*} selector 选择器匹配串
    * @returns 页面元素 HTMLElement
    */
    DoDo.prototype.select = function (selector) {
        return document.querySelector(selector);
    };

    DoDo.prototype.isNullOrUndefined = function (obj) {
        if (obj == null || typeof obj == "undefined" || typeof obj == "null") {
            return true;
        }
        return false;
    };


    /**
     * 元素是否含有某个样式
     * @param {*} cls 样式名称
     * @returns true|false
    */
    HTMLElement.prototype.hasClass = function (cls) {
        var ele = this;
        return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    };

    /**
     * 为元素添加样式
     * @param {*} cls 样式名称
     */
    HTMLElement.prototype.addClass = function (cls) {
        var ele = this;
        if (!ele.hasClass(cls))
            ele.className = ele.className.trim() + " " + cls;
    };

    /**
     * 为元素设置样式
     * @param {*} cls 样式名称
     */
    HTMLElement.prototype.setClass = function (cls) {
        var ele = this;
        ele.className = cls;
    };

    /**
     * 删除指定的样式
     * @param {*} cls 样式名称
     */
    HTMLElement.prototype.removeClass = function (cls) {
        var ele = this;
        if (ele.hasClass(cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    };

    /**
     * 获取元素属性值
     * @param {*} attrName 属性名称
     */
    HTMLElement.prototype.get = function (attrName) {
        var ele = this;
        return ele.getAttribute(attrName);
    };

    /**
     * 设置元素属性值
     * @param {*} attrName 属性名称
     * @param {*} value 属性值
     */
    HTMLElement.prototype.set = function (attrName, value) {
        var ele = this;
        return ele.setAttribute(attrName, value);
    };

    /**
     * 删除元素属性
     * @param {*} attrName 属性名称
     */
    HTMLElement.prototype.remove = function (attrName) {
        var ele = this;
        ele.removeAttribute(attrName);
    };


    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    /**
     * 页面初始化时渲染下拉框 带有样式类 className  的才会按自定样式渲染
     * @param {*} className 未传入样式类名 则渲染该页面全部下拉框
     */
    win.renderSelects = function (className) {
        var selectList;
        if (typeof className != "string" || className.trim().length == 0) {
            selectList = document.querySelectorAll('select');
        } else {
            selectList = document.getElementsByClassName(className);
        }
        for (var i = 0; i < selectList.length; i++) {
            renderOneSelect(selectList[i]);
        }
    }


    //渲染单个select
    win.renderOneSelect = function (el) {
        if (el.nodeName != "SELECT") return;

        try {
            var pTemp = document.createElement("p");
            el.replaceWith(pTemp);

            var divSelect = document.createElement("div");
            divSelect.set("class", "div-select");
            divSelect.append(el);

            divSelect.set("tabindex", "1");
            divSelect.set("onclick", "selectClick(this)");
            divSelect.set("onblur", "selectBlur(this)");

            var divOptions = document.createElement("div");
            divOptions.set("class", "div-options");
            divSelect.append(divOptions);

            var selectedDiv = document.createElement("div");
            //当前选中文本
            selectedDiv.set("class", "div-selected");
            selectedDiv.innerHTML = "<span>&nbsp;</span>"
            divOptions.append(selectedDiv);

            var optionsWrap = document.createElement("div");
            optionsWrap.set("class", "div-option-wrap");
            divOptions.append(optionsWrap);

            // //渲染选项列表
            var optionIndex = 0;
            for (var i = 0; i < el.children.length; i++) {
                var option = el.children[i];

                if (option.nodeName == "OPTION") {
                    var optionDiv = document.createElement("div");
                    optionDiv.set("class", "div-option");
                    optionDiv.set("onclick", "optionClick(this)");
                    optionDiv.set("value", option.get("value"));
                    optionDiv.innerHTML = "<span title='" + option.innerHTML + "'>" + option.innerHTML + "</span>";
                    optionsWrap.append(optionDiv);

                    var selected = option.get("selected");
                    if (typeof (selected) != "undefined" && selected != null) {
                        optionDiv.addClass("option-selected");
                        selectedDiv.innerHTML = "<span title='" + option.innerHTML + "'>" + option.innerHTML + "</span>";
                        el.selectedIndex = optionIndex;
                    }
                    optionIndex++;
                }
            }
            el.renderSelected();

            pTemp.replaceWith(divSelect);

        } catch (err) {
            console.log(err);
        }
    }


    //选择框点击事件
    win.selectClick = function (el) {
        if (el.hasClass("select-open")) {
            el.removeClass("select-open")
        } else {
            el.addClass("select-open");
        }
    }

    //选择框失去焦点事件
    win.selectBlur = function (el) {
        if (el.hasClass("select-open")) {
            el.removeClass("select-open")
        }
    }

    //渲染下拉框的选中值  当使用js代码修改selectedIndex之后调用
    HTMLElement.prototype.renderSelected = function () {
        var ele = this;
        if (this.nodeName == "SELECT") {
            var index = ele.selectedIndex;
            var divOptions = ele.parentElement.children[1];
            if (!!divOptions && divOptions.nodeName == "DIV" && divOptions.hasClass("div-options") && index >= 0) {
                divOptions.children[0].innerHTML = divOptions.children[1].children[index].innerHTML;
                divOptions.children[1].children[index].addClass("option-selected");
            }
        }
    };


    //选项点击事件
    win.optionClick = function (el) {
        var _value = el.get("value");
        var select = el.parentElement.parentElement.parentElement.children[0];
        var originIndex = select.selectedIndex;
        var optionLength = select.children.length;
        for (var i = 0; i < optionLength; i++) {
            if (select.children[i].get("value") == _value) {
                select.children[i].set("selected", "");
            } else {
                select.children[i].remove("selected");
            }
        }
        var selected = el.parentElement.parentElement.children[0];
        selected.innerHTML = el.innerHTML;
        var newIndex = 0;
        for (var i = 0; i < el.parentElement.children.length; i++) {
            var tempEl = el.parentElement.children[i];
            tempEl.removeClass("option-selected");
            if (tempEl.get("value") == _value && tempEl.innerHTML == el.innerHTML) {
                newIndex = i;
            }
        }
        el.addClass("option-selected");

        //设置下拉框 selectedIndex 并触发onchange事件
        if (originIndex != newIndex) {
            select.selectedIndex = newIndex;
            eval(select.get("onchange"));
        }
    }

    win.addListener = function (element, event, fn) {
        if (win.attachEvent) {
            element.attachEvent('on' + event, fn);
        } else {
            element.addEventListener(event, fn, false);
        }
    }

    win.dd = new DoDo();
    win.$ = dd.select;
    win.addListener(win, 'load', function () {
        renderSelects();
    });
})(window);