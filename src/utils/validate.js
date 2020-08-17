/**
 * 过滤特殊字符
 */
export function stripscript(str) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '');
  }
  return rs;
}

/**
 * 验证邮箱
 */
export function validateEmail(value) {
  // 验证邮箱的正则表达式
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

  return !reg.test(value);
}

/**
 * 验证密码 6至20位的字母、数字
 */
export function validatePass(value) {
  // 验证密码的正则表达式
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;

  return !reg.test(value);
}

/**
 * 验证码
 */
export function validateCode(value) {
  // 验证码的正则表达式
  let reg = /^[a-z0-9]{6}$/;

  return !reg.test(value);
}
