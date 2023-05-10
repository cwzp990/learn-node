import axios from 'axios';
import urlJoin from 'url-join';

function getNpmInfo(npmName) {
  const registry = 'https://registry.npmjs.org/';
  const url = urlJoin(registry, npmName);

  return axios.get(url).then((res) => {
    try {
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  });
}

export function getLatestVersion(npmName) {
  return getNpmInfo(npmName).then((data) => {
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      return Promise.reject(new Error('没有最新版本号'));
    }

    return data['dist-tags'].latest;
  });
}
