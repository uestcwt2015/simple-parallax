/** 
 * @file parallax.js
 */

import * as type from './type-validation';
const i = require('../public/img.jpg')

console.log(i);

function Parallax(target, opts = {}) {
  const _target = target;
  const _targetTop = type.isValidNumber(opts.targetTop) ? opts.targetTop : 0;;
  const _bgSrc = opts.bgSrc || '';
  const _bgPosition = type.isValidObject(opts.bgPosition) ? opts.bgPosition : {};
  const _speed = type.isValidNumber(opts.speed) ? opts.speed : 1;
  const _height = type.isValidNumber(opts.height) ? opts.height : 0;

  const _initStyle = {
    width: '100%',
    height: _height + 'px',
    position: 'absoluted',
    zIndex: -100,
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    left: '0px',
    top: _targetTop + 'px'
  };

  const _imgStyle = {
    position: 'absoluted',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    left: _bgPosition.left + 'px',
    top: _bgPosition.top + 'px'
  }

  /**
   * @func _initTarget
   * @desc add some properties to the container element, and add image element
   * @return Null
   */

  function _initTarget() {
    // check node type
    if (_target.nodeType !== 1) {
      throw new Error('target is not a element')
    }

    target.classList.add('parallax-container');

    let propertyNames = Object.keys(_initStyle);
    propertyNames.forEach(name => {
      _target.style[name] = _initStyle[name];
    });

    let img = _createImgNode();
    _target.appendChild(img);
  }

  /** 
   * @func _initEvent
   * @desc add scroll listen handler on target 
   */

  function _initEvent() {
    const scrollParent = _getScrollParent(_target);
    console.log(scrollParent);
  }

  /**
   * @func _getScrollParent
   * @param HTMLElement element 
   * @desc find the scroll container element
   * @return HTMLElement
   */

  function _getScrollParent(element) {
    var parent = element.parentNode;

    if (!parent) {
      return element;
    }

    if (parent === window.document) {
      let body = window.document.body;
      if (body.scrollTop || body.scrollLeft) {
        return body;
      } else {
        return window.document.documentElement;
      }
    }

    const overflowValues = ['scroll', 'auto'];
    if (
      overflowValues.indexOf(_getComputedStyle(parent, 'overflow')) !== -1 ||
      overflowValues.indexOf(_getComputedStyle(parent, 'overflow-x')) !== -1 ||
      overflowValues.indexOf(_getComputedStyle(parent, 'overflow-y')) !== -1
    ) {
      return parent;
    }

    return _getScrollParent(parent);

  }

  /**
   * @func _getComputedStyle
   * @desc get element's computed style
   * @param HTMLElement element 
   * @param String property 
   * @return String
   */
  function _getComputedStyle(element, property) {
    const styles = window.getComputedStyle(element, null);
    return styles[property];
  }

  /**
   * @func _isVisiable
   * @desc 
   */

  function _isVisiable() {
    const rect = _target.getBoundingClientRect();
    const { top, left, bottom, right } = rect;
    console.log(top, left, bottom, right);
  }

  /** 
   * @func _createImgNode
   * @desc create a image element and add some properties on it
   * @return HTMLElement
  */

  function _createImgNode() {
    const img = document.createElement('img');
    img.src = _bgSrc;
    console.log(_bgSrc);
    img.classList.add('parallax-image')

    let propertyNames = Object.keys(_imgStyle);
    propertyNames.forEach(name => {
      img.style[name] = _imgStyle[name];
    });

    return img;
  }

  _initTarget();
  _initEvent();
}

export default Parallax;