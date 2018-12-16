/** 
 * @file parallax.js
 * @author vermouth<uestcwutong@gmail.com>
 */

import * as type from './type-validation';

function Parallax(target, opts = {}) {
  const _target = target;
  const _bgSrc = opts.bgSrc || '';
  const _speed = type.isValidNumber(opts.speed) ? opts.speed : 1;
  const _height = type.isValidNumber(opts.height) ? opts.height : 0;
  let _image = null;

  let _bgPosition = { left: 0, top: 0 };

  const _initStyle = {
    width: '100%',
    height: _height + 'px',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
  };

  const _imgStyle = {
    overflow: 'hidden'
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
    _image.onload = () => {
      _calcInitPos(_image);
      _initEvent();
    }
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
    let prevScrollTop = scrollParent.scrollTop;
    let prevImageTop = _bgPosition.top;
    
    scrollParent.addEventListener('scroll', (e) => {
      let currPosTop = _target.getBoundingClientRect().top;
      let currScrollTop = scrollParent.scrollTop;
      let currImageTop = 0;

      if (currPosTop <= -_height) {
        currImageTop = 0;
      } else if (currPosTop >= viewportHeight) {
        currImageTop = _height - _image.height;
      } else {
        currImageTop = prevImageTop + (currScrollTop - prevScrollTop) * _speed;
        if (currImageTop > 0) {
          currImageTop = 0;
        } 
        if (currImageTop < _height - _image.height) {
          currImageTop = _height - _image.height
        }
      }

      _image.style.transform = `translate3d(${ _bgPosition.left + 'px' }, ${ currImageTop + 'px' }, 0)`;

      prevScrollTop = currScrollTop;
      prevImageTop = currImageTop;
    });
  }

  /** 
   * @func _calcInitPos
   * @desc calcular background image initial position
   * @param HTMLElement img
  */

  function _calcInitPos(img) {
    const scrollParent = _getScrollParent(_target);
    const viewportHeight = scrollParent.clientHeight;
    const targetTop = _target.getBoundingClientRect().top;
    _bgPosition.left = 0;

    if (targetTop < 0) {
      _bgPosition.top = 0;
    } else if (targetTop > viewportHeight - _height) {
      _bgPosition.top = _height - img.height;
    } else {
      _bgPosition.top = -(targetTop / viewportHeight) * img.height;
    }

    img.style.transform = `translate3d(${ _bgPosition.left + 'px' }, ${ _bgPosition.top + 'px' }, 0)`;
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

  function _isValidVisiable(viewportHeight) {
    const rect = _target.getBoundingClientRect();
    const { top } = rect;
    return (viewportHeight - _height) >= top && top >= 0;
  }

  /** 
   * @func _createImgNode
   * @desc create a image element and add some properties on it
   * @return HTMLElement
  */

  function _createImgNode() {
    const img = document.createElement('img');
    img.src = _bgSrc;

    img.classList.add('parallax-image')

    let propertyNames = Object.keys(_imgStyle);
    propertyNames.forEach(name => {
      img.style[name] = _imgStyle[name];
    });

    return img;
  }

  _initTarget();
}

export default Parallax;