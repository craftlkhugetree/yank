let url = 'http://app.dev.angke.com.cn/hq-clgl/rest/notice/query'
let p = {
  filter: {},
  limit: 10,
  page: 1,
};
// navigator.sendBeacon(url, p);

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const xhr = new XMLHttpRequest()
xhr.open('POST', url, true)
xhr.send(p)
xhr.onload = () => {
  console.log(xhr.responseText)
}