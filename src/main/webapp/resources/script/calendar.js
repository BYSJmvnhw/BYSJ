/**
 * Created by zqc on 15-3-31.
 */

define(function(require, exports, module) {

    var $ = require('jquery-plugin').$;

    function slideTab(e) {
        function r(n) {
            t = !0;
            var r = n;
            n.touches && (r = n.touches[0]),
                typeof e.onStart == "function" && e.onStart(r)
        }
        function i(n) {
            if (t) {
                n.preventDefault();
                var r = n;
                n.touches && (r = n.touches[0]),
                    typeof e.onMove == "function" && e.onMove(r)
            }
        }
        function s(n) {
            n.preventDefault();
            if (t) {
                t = !1;
                var r = n;
                n.changedTouches && (r = n.changedTouches[0]),
                    typeof e.onEnd == "function" && e.onEnd(r)
            }
        }
        var t = !1,
            n = document.getElementById(e.id);
        "ontouchstart" in window ? (n.addEventListener("touchstart", r, !1), n.addEventListener("touchmove", i, !1), n.addEventListener("touchend", s, !1)) : (n.addEventListener("mousedown", r, !1), n.addEventListener("mousemove", i, !1), document.addEventListener("mouseup", s, !1))
    }
    function slider(e, t) {
        var n = 0,
            r = 0,
            i = 0,
            s = document.getElementById(e),
            o = s.clientWidth,
            u = o / t;
        slideTab({
            id: e,
            onStart: function(e) {
                n = e.pageX
            },
            onMove: function(e) {
                r = e.pageX - n,
                    s.style.webkitTransform = "translateX(" + (i + r) + "px)"
            },
            onEnd: function(e) {
                var n = i + r,
                    a = 0;
                n >= 0 ? a = 0 : n <= -(o - u / 2) ? a = t - 1 : a = Math.floor(Math.abs(i + r) / u + .5),
                    i = -a * u,
                    s.style.webkitTransition = "-webkit-transform .5s ease",
                    s.style.webkitTransform = "translateX(" + i + "px)";
                var f = sibling(s);
                for (var l = f.length - 1; l >= 0; l--) {
                    var c = f[l].querySelectorAll("li");
                    for (var h = c.length - 1; h >= 0; h--) removeClass(c[h], "cur");
                    addClass(c[a], "cur")
                }
                setTimeout(function() {
                        s.style.webkitTransition = "none"
                    },
                    500)
            }
        })
    }
    function sibling(e) {
        var t = [],
            n = e.parentNode.firstChild;
        for (; n; n = n.nextSibling) n.nodeType === 1 && n !== e && t.push(n);
        return t
    }
    function hasClass(e, t) {
        return e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
    }
    function addClass(e, t) {
        this.hasClass(e, t) || (e.className += " " + t)
    }
    function removeClass(e, t) {
        if (hasClass(e, t)) {
            var n = new RegExp("(\\s|^)" + t + "(\\s|$)");
            e.className = e.className.replace(n, " ")
        }
    }
    Date.prototype.Format = function(e) {
        var t = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
                "H+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                S: this.getMilliseconds()
            },
            n = {
                0 : "日",
                1 : "一",
                2 : "二",
                3 : "三",
                4 : "四",
                5 : "五",
                6 : "六"
            };
        /(y+)/.test(e) && (e = e.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))),
            /(E+)/.test(e) && (e = e.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期": "周": "") + n[this.getDay() + ""]));
        for (var r in t)(new RegExp("(" + r + ")")).test(e) && (e = e.replace(RegExp.$1, RegExp.$1.length == 1 ? t[r] : ("00" + t[r]).substr(("" + t[r]).length)));
        return e
    };
    Date.prototype.AddDays = function(e) {
            var t = new Date(this);
            return t.setDate(this.getDate() + e),
                t
        };
    var getWeekDay = function(e) {
        e = new Date(e);
        var t = ["日", "一", "二", "三", "四", "五", "六"];
        return t[e.getDay()]
    };
    var calendar = function(p, e, t, n) {
        function l() {
            var e = f.getFullYear(),
                t = f.getMonth(),
                n = new Date(e, t, 1),
                r = new Date,
                i = (new Date(e, t + 1, 0)).getDate(),
                s = '<b class="premonth month" title="上一月"><<</b><span class="btn">' + n.Format("yyyy年MM月") + "</span><b class='nextmonth month' title='下一月'>>></b>",
                a = '<table style="width:100%;">';
            a += "<tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr>";
            for (var l = 1,
                     c = 0; c < 42; c++) c % 7 == 0 && (a += "<tr>"),
                c >= n.getDay() && l <= i ? e == r.getFullYear() && t == r.getMonth() && l == r.getDate() ? a += '<td class="today">' + l+++"</td>": a += "<td>" + l+++"</td>": a += "<th></th>",
                c % 7 == 6 && (a += "</tr>");
            a += "</table>",
                o.html(s),
                u.html(a)
        }
        if ($("#calendar").length < 1) {
            var r = '<div id="calendar" onselectstart="return false">';
            r += '<div id="cldtitle" title="选择年份和月份"></div>',
                r += '<div id="clddays"></div>',
                r += "</div>",
                p.append(r);
        }
        var s = $("#calendar"),
            o = $("#cldtitle"),
            u = $("#clddays"),
            a = $("#cldtoday"),
            f = new Date;
        e.toString().indexOf("%") < 1 && (e += "px"),
            t.toString().indexOf("%") < 1 && (t += "px"),
            s.css({
                left: '153px',
                top: '292px',
                width: '332px'
            }),
            l(),
            s.hide().slideDown("fast"),
            u.click(function(e) {
                var t = e.target;
                if(t.tagName.toLowerCase() == "td"){
                    if(o.html().indexOf("月") > -1){
                        o.html('选择具体时间');
                        var time = '<table>';
                        time += '<tr><td data-value="3">3:00</td><td data-value="6">6:00</td><td data-value="9">9:00</td><td data-value="12">12:00</td></tr>',
                            time += '<tr><td data-value="15">15:00</td><td data-value="18">18:00</td><td data-value="21">21:00</td><td data-value="24">24:00</td></tr>',
                            time += "</table>",
                            u.html(time);
                        f.setDate(t.innerHTML);
                    }
                    else if (o.html().indexOf("时间") > -1) {
                        f.setHours(t.innerHTML.split(':')[0]);
                        s.remove();
                        n(f);
                    }
                    else{
                        f.setMonth(t.dataset.value);
                        l();
                    }
                }
            }),
            s.click(function(e) {
                e.stopPropagation()
            }),
            $(document).click(function() {
                s.remove();
            }),
            o.click(function(e) {
                var t = e.target;
                if (t.className == "btn") {
                    o.html('<b class="previous btn"><<</b><span class="zqc-date_span">' + f.Format("yyyy年") + '</span><b class="next btn">>></b>');
                    var n = '<table>';
                    n += '<tr><td data-value="0">1月</td><td data-value="1">2月</td><td data-value="2">3月</td><td data-value="3">4月</td></tr>',
                    n += '<tr><td data-value="4">5月</td><td data-value="5">6月</td><td data-value="6">7月</td><td data-value="7">8月</td></tr>',
                    n += '<tr><td data-value="8">9月</td><td data-value="9">10月</td><td data-value="10">11月</td><td data-value="11">12月</td></tr>',
                    n += "</table>";
                    u.html(n);
                }
                else if (t.classList.contains('month')){
                    if(t.classList.contains('premonth')){
                        f.setMonth(f.getMonth() - 1);
                    }
                    else if(t.classList.contains('nextmonth')) {
                        f.setMonth(f.getMonth() + 1);
                    }
                    o.find("span").text(f.Format("yyyy年MM月"));
                    l();
                }
                else{
                    if(t.classList.contains("previous")){
                        f.setFullYear(f.getFullYear() - 1);
                    }
                    else if(t.classList.contains("next")){
                        f.setFullYear(f.getFullYear() + 1);
                    }
                    o.find("span").text(f.Format("yyyy年"));
                }
            })
        };

    module.exports = {
        getWeekDay: getWeekDay,
        calendar: calendar
    }

});
