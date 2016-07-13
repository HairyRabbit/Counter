window.onload = function () {
    "use strict";

    var inputBox = document.getElementById("calcInput"),
        exprDisp = document.getElementById("calcExpr"),
        backSpaceBtn = document.getElementById("backsp"),
        equalBtn = document.getElementById("equal"),
        clearBtn = document.getElementById("clear"),
        state = {
            init: false,
            get initialized() {
                return this.init;
            },
            set initialized(i) {
                this.init = i;
                var that = this;
                if (i) {
                    exprDisp.textContent = "";
                } else {
                    exprDisp.textContent = this.expression;
                    inputBox.value = this.value;
                }
            },
            expr: "",
            val: 0,
            get expression() {
                return this.expr;
            },
            set expression(x) {
                this.expr = x;
                exprDisp.textContent = (this.initialized ? "" : x);
            },
            get value() {
                return this.val;
            },
            set value(v) {
                this.val = v;
                inputBox.blur();
                if (!this.initialized) {
                    inputBox.value = v;
                }
            }
        }, enter = function () {
            var val = inputBox.value;
            state.expression = val;
            try {
                state.value = new Function("return " + val + "\n;")();
            } catch (e) {
                state.value = "An error occurred.";
            }
            state.initialized = false;
        }, escape = function () {
            state.expression = "";
            state.value = 0;
            state.initialized = false;
        };

    document.body.oncontextmenu = function (e) {
        e.preventDefault();
    };

    inputBox.oncontextmenu = function (e) {
        e.stopPropagation();
    };

    inputBox.onfocus = function () {
        if (!state.initialized) {
            this.select();
            state.initialized = true;
        }
    };

    inputBox.onkeydown = function (e) {
        if (e.keyCode === 13) {
            enter();
        }
    };

    inputBox.onkeyup = function (e) {
        if (e.keyCode === 27) {
            escape();
        }
    };

    backSpaceBtn.onclick = function () {
        var prev = inputBox.value, start = inputBox.selectionStart, end = inputBox.selectionEnd,
            val = state.initialized ? prev.slice(0, (start = (start === end) ? start - 1 : start)) + prev.slice(end) : (state.initialized = true, "");
        inputBox.value = val;
        inputBox.focus();
        setTimeout(function () {
            inputBox.setSelectionRange(start, start);
        }, 10);
    };

    equalBtn.onclick = enter;
    clearBtn.onclick = escape;

    [].forEach.call(document.querySelectorAll("[data-input]"), function (el) {
        el.onclick = function (e) {
            var cur = el.getAttribute("data-input"), prev = inputBox.value, start = inputBox.selectionStart,
                val = state.initialized ? prev.slice(0, start) + cur + prev.slice(inputBox.selectionEnd) : (state.initialized = true, cur),
                len = start + cur.length;
            inputBox.value = val;
            inputBox.focus();
            setTimeout(function () {
                inputBox.setSelectionRange(len, len);
            }, 10);
        };
    });
};
