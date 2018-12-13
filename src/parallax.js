/** 
 * @file parallax.js
 */

import * as type from './type-validation';

function Parallax(target, opts = {}) {
  const _target = target;
  const _targetTop = type.isValidNumber(opts.targetTop) ? opts.targetTop : 0;;
  const _bgSrc = opts.bgSrc || '';
  const _bgPosition = type.isValidObject(opts.bgPosition) ? opts.bgPosition : {};
  const _speed = type.isValidNumber(opts.speed) ? opts.speed : 1;
  const _height = type.isValidNumber(opts.height) ? opts.height : 0;
  let _image = null;

  const _initStyle = {
    width: '100%',
    height: _height + 'px',
    position: 'absolute',
    zIndex: -100,
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    left: '0px',
    top: _targetTop + 'px'
  };

  const _imgStyle = {
    position: 'absolute',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    left: _bgPosition.left || 0 + 'px',
    top: _bgPosition.top || 0 + 'px'
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

    _image = _createImgNode();
    _target.appendChild(_image);
  }

  /** 
   * @func _initEvent
   * @desc add scroll listen handler on target 
   * @return Null
   */

  function _initEvent() {
    const scrollParent = _getScrollParent(_target);
    const viewportHeight = scrollParent.clientHeight;
    let prevScrollTop = 0;
    scrollParent.addEventListener('scroll', () => {
      const visable = _isVisiable(viewportHeight);
      const scrollTop = scrollParent.scrollTop;

      if (visable) {
        _parallaxHandle(prevScrollTop, scrollTop);
      }

      prevScrollTop = scrollTop;
    })
  }

  /** 
   * @func _parallaxHandle
   * @desc scroll handler
   * @param Number prevScrollTop
   * @param Number scrollTop
   * @return Null
  */

  function _parallaxHandle(prevScrollTop, scrollTop) {
    if (_speed === 1) return;
    const diff = scrollTop - prevScrollTop;
    const targetTop = parseInt(_target.style.top);
    const imageTop = parseInt(_image.style.top);
    const imgHeight = _image.clientHeight;
    
    const newImageTop = imageTop - _speed * diff;
    if (newImageTop <= 0 && newImageTop >= (_height - imgHeight)) {
      _image.style.top = newImageTop + 'px';
    }
    // _target.style.top = targetTop - diff + 'px';
   
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
   * @desc check target position
   * @param Number viewportHeight
   * @return Boolean
   */

  function _isVisiable(viewportHeight) {
    const rect = _target.getBoundingClientRect();
    const { top } = rect;

    return top < viewportHeight-_height && top > 0
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