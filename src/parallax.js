/** 
 * @file parallax.js
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
    _image.onload = () => _calcInitPos(_image);
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
    let direction = null;
    let initPosTop = 0;
    

    scrollParent.addEventListener('scroll', (e) => {
      const visable = _isValidVisiable(viewportHeight);
      initPosTop = _bgPosition.top;
      if (visable) {
        let currPosTop = _target.getBoundingClientRect().top;
        let diff = currPosTop + initPosTop;
        _parallaxHandle(diff, direction);
      }
    })
  }

  /** 
   * @func _calcInitPos
   * @desc calcular background image initial position
   * @param HTMLElement img
  */

  function _calcInitPos(img) {
    if (type.isValidObject(opts.bgPosition)) {
      _bgPosition = opts.bgPosition;
    } else {
      const scrollParent = _getScrollParent(_target);
      const viewportHeight = scrollParent.clientHeight;
      const targetTop = _target.getBoundingClientRect().top;
      _bgPosition.left = 0;
      
      if (targetTop < 0) {
        _bgPosition.top = 0
      } else if (targetTop > viewportHeight){
        _bgPosition.top = _height - img.height;
      } else {
        _bgPosition.top = -(targetTop / viewportHeight) * img.height;
      }

      img.style.transform = `translate3d(${ _bgPosition.left + 'px' }, ${ _bgPosition.top + 'px' }, 0)`;
    }
  }

  /** 
   * @func _parallaxHandle
   * @desc scroll handler
   * @param Number diff
   * @param String direction
   * @return Null
  */

  function _parallaxHandle(diff, direction) {
    // if (_speed === 1) return;

    const imgHeight = _image.height;
    const newImageTop = _bgPosition.top - _speed * diff;
    if (newImageTop <= 0 && newImageTop >= (_height - imgHeight)) {
      _image.style.transform = `translate3d(${ _bgPosition.left + 'px' }, ${ newImageTop + 'px' }, 0)`;
    }
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

  // /**
  //  * @func _getOffsetTop
  //  * @desc calcular the distance that is from element's top to page's top
  //  * @param HTMLElement element 
  //  * @return Number
  //  */
  
  // function _getOffsetTop(element, ansOffsetTop=0) {
  //   var parent = element.offsetParent;

  //   if (!parent || parent === window.body || parent === window.document.documentElement) return ansOffsetTop;

  //   ansOffsetTop += element.offsetTop;
    
  //   return _getOffsetTop(parent, ansOffsetTop);
  // }

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

    return top <= viewportHeight - _height && top >= 0;
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
  _initEvent();
}

export default Parallax;