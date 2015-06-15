$(function() {
  'use strict';

  var getCode = function() {
    return Promise.resolve(location.href.match(/code=(\S*)/)[1]);
  };

  getCode().then(function(code) {
    return window.comeeting.getAccessToken(code);
  }).then(function() {
    return window.comeeting.getUserInfo();
  }).then(function() {
    return window.comeeting.getGroupInfo();
  }).then(function() {
    console.log(':)');
    setTimeout(function() {
      window.close();
    }, 1000);
  });

  var btnClose = document.querySelector('[btn-close]');
  btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    window.close();
  });

});
