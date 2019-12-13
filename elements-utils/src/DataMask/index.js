export function characterLimitMask (limit = 0, allowWhiteSpace = false) {
  return (val = '') => {
    const characters = allowWhiteSpace ? '.' : '\\w';
    const limitExpr = new RegExp(`(${characters}{0,${limit}})`);
    return val.match(limitExpr)[1];
  }
}

export function creditCardMask (val = '') {
  const card = numbersOnlyMask(val).match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
  return `${card[1]}${card[2] && ` ${card[2]}`}${card[3] && ` ${card[3]}`}${card[4] && ` ${card[4]}`}`;
}

export function numbersOnlyMask (val = '') {
  return val.replace(/\D/g, '');
}

export function phoneMask1 (val = '') {
  const phone = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  return `${!phone[2] ? phone[1] : `(${phone[1]}) `}${phone[2]}${phone[3] && `-${phone[3]}`}`;
}

export function phoneMask2 (val = '') {
  const phone = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  return `${phone[1]}${phone[2] && `-${phone[2]}`}${phone[3] && `-${phone[3]}`}`;
}

export function ssnMask (val = '') {
  const phone = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,2})(\d{0,4})/);

  return `${phone[1]}${phone[2] && `-${phone[2]}`}${phone[3] && `-${phone[3]}`}`;
}

export function zipcodeMask (val = '') {
  const phone = numbersOnlyMask(val).match(/(\d{0,5})(\d{0,4})/);

  return `${!phone[2] ? phone[1] : `${phone[1]}-`}${phone[2]}`;
}