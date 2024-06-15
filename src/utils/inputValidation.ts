/* eslint-disable no-useless-escape */

interface BooleanObj {
  [index: string]: boolean;
}

// Touches
export const getTouches = (keys: Array<string>) => {
  const touchesObj: BooleanObj = {};
  for (let i = 0; i < keys.length; i++) {
    touchesObj[keys[i]] = false;
  }
  return touchesObj;
};

export const fieldsFilled = (fields: Array<string>, touchesObj: BooleanObj) => {
  for (let i = 0; i < fields.length; i++) {
    if (!touchesObj[fields[i]]) {
      return false;
    }
  }
  return true;
};

// Helpers
export const scrollToElem = (sel: string) => {
  setTimeout(() => {
    const errorElem = document.querySelector(`${sel} input`);
    if (errorElem) {
      (errorElem as HTMLElement).focus();
      (errorElem as HTMLElement).scrollIntoView();
    }
  });
};

// Input Limitators
export const lengthLimitator = (value: string, max: number, min = 0) => {
  if (value.length > max) return false;
  if (value.length < min) return false;
  return true;
};

export const IsWithinValidLength = (fieldName: string, value: any) => {
  if (typeof value !== 'string') return true;

  switch (fieldName) {
    case 'displayName':
      return lengthLimitator(value, 16);
    case 'password':
      return lengthLimitator(value, 24);
    case 'gender':
      return lengthLimitator(value, 16);
    case 'twitter_id':
      return lengthLimitator(value, 16);
    case 'discord_id':
      return lengthLimitator(value, 16);
    case 'website':
      return lengthLimitator(value, 82);
    case 'password':
    case 'newPassword':
    case 'cNewPassword':
    case 'oldPassword':
      return lengthLimitator(value, 32);
    default:
      return true;
  }
};

// Generic
export const vByLength = (value: string, touched: boolean, t: any) => {
  if (!touched) {
    return '';
  }
  if (value === '') {
    return t('empty field message');
  }
  return '';
};

// Email Input
export const vEmail = (email: string, touched: boolean, t: any) => {
  if (!touched) {
    return '';
  }

  if (email === '') {
    return t('empty field message');
  }
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(String(email).toLowerCase())) {
    return t('invalid email input');
  }
  return '';
};

// Password Input
export const vPassword = (password: string, touched: boolean, t: any, login: boolean = false) => {
  if (!touched) {
    return '';
  }

  if (password === '') {
    return t('empty field message');
  }
  if (password.length < 8 || password.length > 24) {
    if (!login) return t('password length error', { min: 8, max: 24 });
  }
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!regex.test(String(password)) && !login) {
    return t('invalid password input');
  }
  return '';
};

// Password Confirmation Input
export const vCpassword = (password: string, cPassword: string, touched: boolean, t: any) => {
  if (!touched) {
    return '';
  }
  if (password !== cPassword) {
    return t('passwords do not match');
  }
  return '';
};

export const vLoginPassword = (
  password: string,
  errorMessage: string,
  touched: boolean,
  t: any,
) => {
  if (errorMessage !== '') {
    return t('auth/wrong-password');
  }
  return vPassword(password, touched, t, true);
};
