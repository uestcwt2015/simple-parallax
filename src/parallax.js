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

  function _initTargetStyle() {
    // 节点类型校验
    if (_target.nodeType !== 1) {
      throw new Error('target is not a element')
    }

    target.classList.add('parallax-container');

    let propertyNames = Object.keys(_initStyle);
    propertyNames.forEach(name => {
      _target.style[name] = _initStyle[name];
    });
  }

  _initTargetStyle();
}

export default Parallax;