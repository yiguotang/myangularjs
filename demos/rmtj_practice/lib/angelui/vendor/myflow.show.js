var currentType = -1;
/*0:编辑任务流程步,1:添加任务流程步,2:添加连线,3:编辑连线,4 添加网关*/
(function ($) {

    var myflow = {};

    var _states_temp;
    var _paths_temp;

    myflow.config = {
        readonly:"",
        editable: true,
        lineHeight: 15,
        basePath: '',
        rect: {// 状态
            attr: {
                x: 10,
                y: 10,
                width: 100,
                height: 50,
                r: 5,
                fill: '90-#fff-#C0C0C0',
                stroke: '#000',
                "stroke-width": 1
            },
            showType: 'image&text', // image,text,image&text
            type: 'state',
            name: {
                text: 'state',
                'font-style': 'italic'
            },
            text: {
                value: '状态',
                'font-size': 13
            },
            margin: 5,
            props: [],
            img: {}
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#808080',
                    fill: "none",
                    "stroke-width": 2
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#808080',
                    fill: "#808080",
                    "stroke-width": 2,
                    radius: 4
                },
                fromDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                toDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                bigDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 2
                },
                smallDot: {
                    width: 5,
                    height: 5,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    cursor: "move",
                    'background': '#000',
                    "font-size": 12
                }
            },
            text: {
                value: 'TO {to}',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                start_task_def_key: { value: '' },
                end_task_def_key: { value: '' }
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {
                    alert(data);
                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 10,
                right: 30
            },
            props: {}
        },
        restore: {
            rectAttr:{
                "stroke-width": 2,
                fill:"#E0AA0F"
            }
        },
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            rectAttr: {
                stroke: '#00ff00',
                "stroke-width": 2
            },
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        }
    };

    myflow.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        nextId: (function () {
            var uid = 0;
            return function () {
                return ++uid;
            };
        })(),

        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1, yFlag = start.x < end.x
                ? -1
                : 1, arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        }
    };

    myflow.rect = function (o, r) {
        var _color='#000', _this = this, _uid = myflow.util.nextId(), _o = $.extend(true, {},
                myflow.config.rect, o), _id = 'rect' + _uid, _r = r, // Raphael画笔
            _rect, _img, // 图标
            _name, // 状态名称
            _text, // 显示文本
            _ox, _oy; // 拖动时，保存起点位置;
        _o.text.value += _uid;

        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
            _o.attr.r).hide().attr(_o.attr);

        _img = _r.image(myflow.config.basePath + _o.img.src,
            _o.attr.x + _o.img.width / 2,
            _o.attr.y + (_o.attr.height - _o.img.height) / 2, _o.img.width,
            _o.img.height).hide();
        _name = _r.text(
                _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
                _o.attr.y + myflow.config.lineHeight / 2, _o.name.text).hide()
            .attr(_o.name);
        _text = _r.text(
                _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
                _o.attr.y + (_o.attr.height - myflow.config.lineHeight) / 2
                    + myflow.config.lineHeight, _o.text.value).hide()
            .attr(_o.text); // 文本



        // 改变大小的边框
        var _bpath, _bdots = {}, _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        _bpath = _r.path('M0 0L1 1').hide();
        _bdots['t'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide();
        _bdots['lt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'nw-resize'
        }).hide();
        _bdots['l'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        _bdots['lb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'sw-resize'
        }).hide();
        _bdots['b'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide();
        _bdots['rb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'se-resize'
        }).hide();
        _bdots['r'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        _bdots['rt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'ne-resize'
        }).hide();
        $([_bdots['t'].node, _bdots['lt'].node, _bdots['l'].node, _bdots['lb'].node, _bdots['b'].node, _bdots['rb'].node, _bdots['r'].node, _bdots['rt'].node]).click(function () {
            return false;
        });



        // 边框路径
        function getBoxPathString() {
            return 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
                + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
                + ' ' + (_bbox.y + _bbox.height) + 'L'
                + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
                + ' ' + _bbox.y;
        }


        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image':
                    _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'text':
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,
                        y: ry + rh / 2
                    }).show(); // 文本
                    break;
                case 'image&text':
                    _rect.show();
                    _name.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + myflow.config.lineHeight / 2
                    }).show();
                    _text.attr({
                        x: rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + (rh - myflow.config.lineHeight) / 4
                            + myflow.config.lineHeight
                    }).show(); // 文本
                    _img.attr({
                        x: rx + _o.img.width / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }

            _bdots['t'].attr({
                x: _bbox.x + _bbox.width / 2 - _bw / 2,
                y: _bbox.y - _bw / 2
            }); // 上
            _bdots['lt'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2
            }); // 左上
            _bdots['l'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            }); // 左
            _bdots['lb'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 左下
            _bdots['b'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 下
            _bdots['rb'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height
            }); // 右下
            _bdots['r'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            }); // 右
            _bdots['rt'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2
            }); // 右上
            _bpath.attr({
                path: getBoxPathString()
            });

            $(_r).trigger('rectresize', _this);
        }

        // 函数----------------
        // 转化json字串
        this.toJson = function () {
            var data = "{type:'" + _o.type + "',text:{value:'"
                + _text.attr('text') + "'}, attr:{ x:"
                + Math.round(_rect.attr('x')) + ", y:"
                + Math.round(_rect.attr('y')) + ", width:"
                + Math.round(_rect.attr('width')) + ", height:"
                + Math.round(_rect.attr('height')) + "}, props:{";
            for (var k in _o.props) {
                data += k + ":{value:'"
                    + _o.props[k].value + "'},";
            }
            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += "}}";
            return data;
        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);
            _o = $.extend(true, _o, data);
            _text.attr({
                text: obj.text.value
            });
            resize();
        };

        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.remove = function () {
            _rect.remove();
            _text.remove();
            _name.remove();
            _img.remove();
            _bpath.remove();
            for (var k in _bdots) {
                _bdots[k].remove();
            }
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };

        resize(); // 初始化位置
    };

    myflow.path = function (o, r, from, to) {
        var _this = this, _r = r, _o = $.extend(true, {}, myflow.config.path), _path, _arrow, _text, _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = 'path'
            + myflow.util.nextId(), _dotList, _autoText = true;

        // 点
        function dot(type, pos, left, right) {
            var _this = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
                _pos = pos; // 缓存位置信息{x,y}, 注意：这是计算出中心点

            switch (_t) {
                case 'from':
                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                            pos.y - _o.attr.fromDot.height / 2,
                            _o.attr.fromDot.width, _o.attr.fromDot.height)
                        .attr(_o.attr.fromDot);
                    break;
                case 'big':
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                            pos.y - _o.attr.bigDot.height / 2,
                            _o.attr.bigDot.width, _o.attr.bigDot.height)
                        .attr(_o.attr.bigDot);
                    break;
                case 'small':
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                            pos.y - _o.attr.smallDot.height / 2,
                            _o.attr.smallDot.width, _o.attr.smallDot.height)
                        .attr(_o.attr.smallDot);
                    break;
                case 'to':
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                            pos.y - _o.attr.toDot.height / 2,
                            _o.attr.toDot.width, _o.attr.toDot.height)
                        .attr(_o.attr.toDot);

                    break;
            }

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {
                if (pos) {
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from':
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(myflow.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(myflow.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        break;
                    case 'big':

                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(myflow.util.connPoint(
                                _to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(myflow.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt
                                .pos(myflow.util.center(_pos, _rt.right()
                                    .pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (myflow.util.isLine(_lt.left().pos(), pos, _rt
                            .right().pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small': // 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !myflow.util.isLine(_lt.pos(), {
                            x: _pos.x,
                            y: _pos.y
                        }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', myflow.util.center(_lt
                                .pos(), _pos), _lt, _lt
                                .right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', myflow.util.center(_rt
                                .pos(), _pos), _rt.left(),
                                _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to':
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(myflow.util.connPoint(_from
                                .getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(myflow.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }

                refreshpath();
            };
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
                .getBBox(), _fromPos, _toPos;

            _fromPos = myflow.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = myflow.util.connPoint(_toBB, _fromPos);

            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = 'M' + d.pos().x + ' ' + d.pos().y, arr = '';
                // 线的路径
                while (d.right()) {
                    d = d.right();
                    p += 'L' + d.pos().x + ' ' + d.pos().y;
                }
                // 箭头路径
                var arrPos = myflow.util.arrow(d.left().pos(), d.pos(),
                    _o.attr.arrow.radius);
                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                    + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                    + arrPos[2].y + 'z';
                return [p, arr];
            };
            this.toJson = function () {
                var data = "", d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data += "{x:" + Math.round(d.pos().x) + ",y:"
                            + Math.round(d.pos().y) + "},";
                    d = d.right();
                }
                if (data.substring(data.length - 1, data.length) == ',')
                    data = data.substring(0, data.length - 1);
                return data;
            };
            this.restore = function (data) {
                var obj = data, d = _fromDot.right();

                for (var i = 0; i < obj.length; i++) {
                    d.moveTo(obj[i].x, obj[i].y);
                    d.moveTo(obj[i].x, obj[i].y);
                    d = d.right();
                }

                this.hide();
            };

            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
        }

        // 初始化操作
        _o = $.extend(true, _o, o);
        _path = _r.path(_o.attr.path.path).attr(_o.attr.path);
        _arrow = _r.path(_o.attr.arrow.path).attr(_o.attr.arrow);

        _dotList = new dotList();
        _dotList.hide();

        _text = _r.text(0, 0, _o.text.value || _o.text.value.replace('{from}', _from.text()).replace('{to}',
            _to.text())).attr(_o.attr.text);
        _text.drag(function (dx, dy) {
            if (!myflow.config.editable)
                return;
            _text.attr({
                x: _ox + dx,
                y: _oy + dy
            });
        }, function () {
            _ox = _text.attr('x');
            _oy = _text.attr('y');
        }, function () {
            var mid = _dotList.midDot().pos();
            _textPos = {
                x: _text.attr('x') - mid.x,
                y: _text.attr('y') - mid.y
            };
        });

        refreshpath(); // 初始化路径

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        // 转化json数据
        this.toJson = function () {
            var data = "{from:'" + _from.getId() + "',to:'" + _to.getId()
                + "', dots:'[" + _dotList.toJson() + "]',text:{value:'"
                + _text.attr('text') + "',textPos:{x:"
                + Math.round(_textPos.x) + ",y:" + Math.round(_textPos.y)
                + "}}, props:{";
            for (var k in _o.props) {
                data += k + ":{value:'"
                    + _o.props[k].value + "'},";
            }
            if (data.substring(data.length - 1, data.length) == ',')
                data = data.substring(0, data.length - 1);
            data += '}}';
            return data;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;

            _o = $.extend(true, _o, data);
            //$('body').append('['+_text.attr('text')+','+_o.text.value+']');
            if (_text.attr('text') != _o.text.value) {
                //$('body').append('['+_text.attr('text')+','+_o.text.value+']');
                _text.attr({ text: _o.text.value });
                _autoText = false;
            }

            _dotList.restore(obj.dots);
        };
        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            _path.attr({
                path: p[0]
            });
            _arrow.attr({
                path: p[1]
            });
            _text.attr({
                x: mid.x + _textPos.x,
                y: mid.y + _textPos.y
            });
            // $('body').append('refresh.');
        }

        this.getId = function () {
            return _id;
        };
        this.text = function () {
            return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };

    };

    myflow.props = function (o, r) {

    };


    // 初始化流程
    myflow.init = function (c, o) {
        var _w = $(c).width(), _h = $(c).height(), _r = Raphael(c, _w, _h), _states = {}, _paths = {};

        $.extend(true, myflow.config, o);

        // 模式
        $(_r).data('mod', 'point');

        // 恢复
        if (o.restore) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = o.restore;
            var rmap = {};
            if (data.states) {
                for (var k in data.states) {
                    if(data.states[k].subprocess=="yes"){
                        data.states[k].attr.fill="#E0AA0F";
                        data.states[k].attr.cursor="pointer";
                    }
                    //data.states[k].attr.fill="#E0AA0F"
                    var rect = new myflow.rect(
                        $
                            .extend(
                            true,
                            {},
                            myflow.config.tools.states[data.states[k].type],
                            data.states[k]), _r);
                    rect.restore(data.states[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                }
            }
            if (data.paths) {
                for (var k in data.paths) {
                    var p = new myflow.path($.extend(true, {},
                        myflow.config.tools.path, data.paths[k]),
                        _r, rmap[data.paths[k].from],
                        rmap[data.paths[k].to]);
                    p.restore(data.paths[k]);
                    _paths[p.getId()] = p;
                }
            }
        }
        // 历史状态
        var hr = myflow.config.historyRects, ar = myflow.config.activeRects;
        if (hr.rects.length || ar.rects.length) {
            var pmap = {}, rmap = {};
            for (var pid in _paths) {// 先组织MAP

                var nodeObj = eval("(" + _states[_paths[pid].from().getId()].toJson() + ")");
                var nodeName = "rect" + nodeObj.props.task_def_key.value.replace('{', '').replace('}', '');

                if (!rmap[nodeName]) {
                    rmap[nodeName] = {
                        rect: _paths[pid].from(),
                        paths: {}
                    };
                }
                var pathObj = eval("(" + _paths[pid].toJson() + ")");
                var pathName = "path" + pathObj.props.id.value.replace('{', '').replace('}', '');
                rmap[nodeName].paths[pathName] = _paths[pid];

                nodeObj = eval("(" + _states[_paths[pid].to().getId()].toJson() + ")");
                nodeName = "rect" + nodeObj.props.task_def_key.value.replace('{', '').replace('}', '');

                if (!rmap[nodeName]) {
                    rmap[nodeName] = {
                        rect: _paths[pid].to(),
                        paths: {}
                    };
                }
            }
            for (var i = 0; i < hr.rects.length; i++) {
                if (rmap[hr.rects[i].name]) {
                    if(hr.rects[i].subprocess == "yes"){
                        hr.rectAttr.fill="#E0AA0F";
                        hr.rectAttr.cursor="pointer";
                    }
                    rmap[hr.rects[i].name].rect.attr(hr.rectAttr);
                }
                for (var j = 0; j < hr.rects[i].paths.length; j++) {
                    if (rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]) {
                        rmap[hr.rects[i].name].paths[hr.rects[i].paths[j]]
                            .attr(hr.pathAttr);
                    }
                }
            }
            for (var i = 0; i < ar.rects.length; i++) {
                if (rmap[ar.rects[i].name]) {
                    rmap[ar.rects[i].name].rect.attr(ar.rectAttr);
                }
                for (var j = 0; j < ar.rects[i].paths.length; j++) {
                    if (rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]) {
                        rmap[ar.rects[i].name].paths[ar.rects[i].paths[j]]
                            .attr(ar.pathAttr);
                    }
                }
            }
        }
    };

    // 添加jquery方法
    $.fn.myflow = function (o) {
        return this.each(function () {
            myflow.init(this, o);
        });
    };

    $.myflow = myflow;
})
    (jQuery);