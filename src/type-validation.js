/** 
 * @file type-validation
 */

function getPrimitiveType(obj) {
  let typeString = Object.prototype.toString.call(obj);
  const reg = /[A-Z]+[a-z]+/;
  return typeString.match(reg)[0];
}

export function isValidObject(obj) {
  return getPrimitiveType(obj) === 'Obejct' && Object.keys(obj).length !== 0;
}

export function isValidNumber(obj) {
  return getPrimitiveType(obj) === 'Number';
}