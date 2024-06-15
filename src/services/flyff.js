import requestSrv from './index';

const FLYFF_API_BASE_URL = import.meta.env.VITE_FLYFF_API_BASE_URL;

const request = ({ data, path, method }) => {
  return new Promise((resolve, reject) => {
    requestSrv({
      customRequestUrl: `${FLYFF_API_BASE_URL}/${path}`,
      path,
      method,
      data,
    })
      .then((res) => resolve(res.data))
      .catch((error) => reject(error));
  });
};

function getAllItems() {
  return request({
    path: `item`,
  });
}

export default {
  getAllItems,
};
