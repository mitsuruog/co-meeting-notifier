$(function() {
  'use strict';

  var btnSignin = document.querySelector('[btn-signin]');
  var btnSignout = document.querySelector('[btn-signout]');
  var accountName = document.querySelector('.account-name');
  var accountImage = document.querySelector('.account-image');
  var accountInfo = document.querySelector('.account-info');

  var render = function() {
    var isActive = window.comeeting.getToken();
    if(isActive) {
      var account = window.comeeting.getAccount();
      accountName.textContent = account.name + '(' + account.screen_name + ')';
      // co-meeting側のバグっぽい
      accountImage.src = account.icon_url.replace(/^http:\/\/www.co-meeting.com/, '');
      accountInfo.style.visibility = 'visible';
    } else {
      accountName.textContent = '';
      accountImage.src = '';
      accountInfo.style.visibility = 'hidden';
    }
    btnSignin.disabled = isActive;
    btnSignout.disabled = !isActive;
  };

  render();

  btnSignin.addEventListener('click', function(e) {
    e.preventDefault();
    var url = window.comeetingConfig.URL.AUTHORIZE + '?response_type=code&client_id=' +
      window.comeetingConfig.OAUTH_CONSUMER_KEY +
      '&redirect_uri=' + window.comeetingConfig.URL.REDIRECT;
    window.open(url);
    setTimeout(function() {
      render();
    }, 5000);
  });

  btnSignout.addEventListener('click', function(e) {
    e.preventDefault();
    window.comeeting.clearAll();
    render();
  });

});
