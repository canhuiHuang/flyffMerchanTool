import axios from 'axios';

axios.defaults.baseURL = import.meta.env.BASE_URL;

export default function executeRequest({ path, data = {}, method = 'GET', headers, params, customRequestUrl }) {
  function setQueryString(queryStringObj, methodReq) {
    // axios.defaults.headers.common['Accept-Language'] = 'en';

    if (methodReq === 'GET') {
      let queryString = '';
      const firstKeyProp = Object.keys(queryStringObj)[0];

      Object.keys(queryStringObj).forEach((prop) => {
        queryString += `${prop === firstKeyProp ? '?' : '&'}${prop}=${queryStringObj[prop]}`;
      });

      return queryString;
    }

    return '';
  }

  const url = `${path}${setQueryString(data, method)}`;

  return axios({
    method,
    url: customRequestUrl || url,
    data,
    headers,
    params,
    withCredentials: false,
  })
    .then((res) => Promise.resolve(res))
    .catch((error) => Promise.reject(error));
}
