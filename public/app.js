'use strict';

const URL = 'https://github.com/login/oauth/authorize';

const options = {
  client_id: '2da435ca55f2f5a29f7d',
  scope: 'read:user',
  state: 'abood zeekoo white hacker',
};

const queryString = Object.keys(options)
  .map((key) => {
    return `${key}=${encodeURI(options[key])}`;
  })
  .join('&');

console.log('query', queryString);

const authURL = `${URL}?${queryString}`;

const linkTag = document.getElementById('oauth');
linkTag.setAttribute('href', authURL);
