'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _antd = require('antd');

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualTable = function (_Component) {
  _inherits(VirtualTable, _Component);

  _createClass(VirtualTable, null, [{
    key: 'FillNode',
    value: function FillNode(_ref) {
      var height = _ref.height,
          node = _ref.node,
          marginTop = _ref.marginTop,
          marginBottom = _ref.marginBottom;

      if (node) {
        marginTop = marginTop || 0;
        marginBottom = marginBottom || 0;
        height = height || 0;
        return _reactDom2.default.createPortal(_react2.default.createElement('div', { style: { height: height + 'px', marginTop: marginTop + 'px', marginBottom: marginBottom + 'px' } }), node);
      }
      return null;
    }
  }]);

  function VirtualTable(props) {
    _classCallCheck(this, VirtualTable);

    var _this = _possibleConstructorReturn(this, (VirtualTable.__proto__ || Object.getPrototypeOf(VirtualTable)).call(this, props));

    _this.handleScrollEvent = function (e) {
      var dataSource = _this.props.dataSource;

      _this.handleScroll((dataSource || []).length);
    };

    _this.handleScroll = function (length) {
      var _this$state = _this.state,
          rowHeight = _this$state.rowHeight,
          maxTotalHeight = _this$state.maxTotalHeight;

      if (rowHeight && length) {
        var visibleHeight = _this.refScroll.clientHeight; // 显示的高度
        var scrollTop = _this.refScroll.scrollTop; // 滑动的距离
        _this.handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop);
      } else {
        _this.setRowHeight();
      }
    };

    _this.state = {
      startIndex: 0,
      visibleRowCount: 0,
      thresholdCount: 40,
      rowHeight: 0,
      topBlankHeight: 0,
      bottomBlankHeight: 0,
      maxTotalHeight: 15000000
    };
    return _this;
  }

  _createClass(VirtualTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refScroll = _reactDom2.default.findDOMNode(this).getElementsByClassName('ant-table-body')[0];
      // this.refInnerScroll = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-body-inner')[0]

      this.listenEvent = (0, _lodash2.default)(this.handleScrollEvent, 50);

      if (this.refScroll) {
        this.refScroll.addEventListener('scroll', this.listenEvent);
      }

      this.createTopFillNode();
      this.createBottomFillNode();
      // 初始化设置滚动条
      this.setRowHeight();
      this.handleScrollEvent();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var dataSource = nextProps.dataSource;
      var tdataSource = this.props.dataSource;

      if (dataSource && dataSource.length != tdataSource.length) {
        this.refScroll.scrollTop = 0;
        this.handleScroll(dataSource.length);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.refScroll) {
        this.refScroll.removeEventListener('scroll', this.listenEvent);
      }
    }
  }, {
    key: 'createTopFillNode',
    value: function createTopFillNode() {
      if (this.refScroll) {
        var ele = document.createElement('div');
        this.refScroll.insertBefore(ele, this.refScroll.firstChild);
        this.refTopNode = ele;
      }
    }
  }, {
    key: 'createBottomFillNode',
    value: function createBottomFillNode() {
      if (this.refScroll) {
        var ele = document.createElement('div');
        this.refScroll.appendChild(ele);
        this.refBottomNode = ele;
      }
    }
  }, {
    key: 'setRowHeight',
    value: function setRowHeight() {
      this.refTable = this.refScroll.getElementsByTagName('table')[0];
      if (this.refTable) {
        var tr = this.refTable.getElementsByTagName('tr')[0];
        var rowHeight = tr && tr.clientHeight || 0;
        this.state.rowHeight = rowHeight;
      }
    }
  }, {
    key: 'getIndexByScrollTop',
    value: function getIndexByScrollTop(rowHeight, scrollTop) {
      var index = (scrollTop - scrollTop % rowHeight) / rowHeight;
      return index;
    }
  }, {
    key: 'handleBlankHeight',
    value: function handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop) {
      var oriRowHeight = rowHeight;
      var totalHeight = length * rowHeight;
      var isBigData = false;
      if (totalHeight > maxTotalHeight) {
        isBigData = true;
        totalHeight = maxTotalHeight;
        rowHeight = totalHeight / length;
        scrollTop = scrollTop > maxTotalHeight ? maxTotalHeight : scrollTop;
      }
      if (length >= 10000) {
        isBigData = true;
      }
      var topBlankHeight = void 0,
          bottomBlankHeight = void 0,
          startIndex = void 0,
          visibleRowCount = void 0;
      startIndex = this.getIndexByScrollTop(rowHeight, scrollTop);
      visibleRowCount = Math.ceil(visibleHeight / oriRowHeight);
      topBlankHeight = rowHeight * startIndex;
      topBlankHeight = this.getValidValue(topBlankHeight, 0, totalHeight);
      bottomBlankHeight = totalHeight - topBlankHeight - visibleHeight;
      bottomBlankHeight = bottomBlankHeight > 0 ? bottomBlankHeight : 0;

      var slideUpHeight = Math.abs(topBlankHeight - this.state.topBlankHeight);
      var slideDownHeight = Math.abs(bottomBlankHeight - this.state.bottomBlankHeight);

      if (!this.lastSlideUpHeight) {
        this.sameSlideHeightCount = 0;
        this.lastSlideUpHeight = slideUpHeight;
      } else if (this.lastSlideUpHeight === slideUpHeight) {
        this.sameSlideHeightCount++;
      } else {
        this.lastSlideUpHeight = slideUpHeight;
        this.sameSlideHeightCount = 0;
      }

      // console.log('===================')
      // console.log('oriRowHeight', oriRowHeight)
      // console.log('rowHeight', rowHeight)
      // console.log('totalHeight', totalHeight)
      // console.log('visibleHeight', visibleHeight)
      // console.log('scrollTop', scrollTop)
      // console.log('topBlankHeight', topBlankHeight)
      // console.log('bottomBlankHeight', bottomBlankHeight)
      // console.log('startIndex', startIndex)
      // console.log('visibleRowCount', visibleRowCount)
      // console.log('slideUpHeight', slideUpHeight)
      // console.log('slideDownHeight', slideDownHeight)

      var isValid = slideUpHeight >= rowHeight;
      isValid = isValid || slideDownHeight >= rowHeight;
      isValid = isValid || startIndex === 0;
      if (isValid) {
        startIndex = startIndex - 5;
        visibleRowCount = visibleRowCount + 5;
        this.setState({
          startIndex: startIndex,
          visibleRowCount: visibleRowCount,
          topBlankHeight: topBlankHeight,
          bottomBlankHeight: bottomBlankHeight
        });
        if (isBigData && this.sameSlideHeightCount >= 1) {
          // 防止大数据持续滚动期间出现空白的问题
          this.refScroll.scrollTop = scrollTop;
          this.sameSlideHeightCount = 0;
          // console.log('set this.refScroll.scrollTop=', scrollTop)
        }
      }
    }
  }, {
    key: 'checkValidIntervalTime',
    value: function checkValidIntervalTime(timeKey) {
      var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

      var cur = Date.now();
      if (!this[timeKey] || cur - this[timeKey] >= interval) {
        this[timeKey] = cur;
        return true;
      }
      return false;
    }
  }, {
    key: 'getValidValue',
    value: function getValidValue(val) {
      var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 40;

      if (val < min) {
        return min;
      } else if (val > max) {
        return max;
      }
      return val;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          dataSource = _props.dataSource,
          rest = _objectWithoutProperties(_props, ['dataSource']);

      var _state = this.state,
          topBlankHeight = _state.topBlankHeight,
          bottomBlankHeight = _state.bottomBlankHeight,
          startIndex = _state.startIndex,
          visibleRowCount = _state.visibleRowCount,
          rowHeight = _state.rowHeight,
          thresholdCount = _state.thresholdCount;

      var _ref2 = dataSource || [],
          length = _ref2.length;

      var startCount = length - visibleRowCount;
      startCount = startCount > 0 ? startCount : length;
      var startIn = this.getValidValue(startIndex, 0, startCount);
      var endIn = startIndex + visibleRowCount;
      if (!endIn) {
        // 初始化渲染数据
        endIn = length > thresholdCount ? thresholdCount : length;
      }
      endIn = this.getValidValue(endIn, startIndex, length);
      var data = (dataSource || []).slice(startIn, endIn);
      // console.log(startIn, endIn, visibleRowCount, length)

      return _react2.default.createElement(
        _react.Fragment,
        null,
        _react2.default.createElement(VirtualTable.FillNode, {
          height: topBlankHeight,
          node: this.refTopNode
        }),
        _react2.default.createElement(_antd.Table, _extends({}, rest, {
          dataSource: data
        })),
        _react2.default.createElement(VirtualTable.FillNode, {
          height: bottomBlankHeight,
          node: this.refBottomNode
        })
      );
    }
  }]);

  return VirtualTable;
}(_react.Component);

exports.default = VirtualTable;