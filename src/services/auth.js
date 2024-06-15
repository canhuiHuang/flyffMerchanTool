import requestSrv from './index';

const register = (data) => {
  return new Promise((resolve, reject) => {
    requestSrv({
      method: 'POST',
      path: `auth/register`,
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

const login = (data) => {
  return new Promise((resolve, reject) => {
    requestSrv({
      method: 'POST',
      path: `auth/login`,
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

export default {
  register,
  login,
};
