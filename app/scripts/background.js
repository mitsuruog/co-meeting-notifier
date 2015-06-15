(function() {
  'use strict';

  var update = function() {
    comeeting.getGroupInfo().then(function(groups) {
      return comeeting.getUnleadCount(groups);
    }).then(function(unReadCount) {
      return render(unReadCount);
    }).then(function() {
      console.log(':)');
    });
  };

  var render = function(unReadCount) {
    var values = {};

    // 未認証の場合
    if(!comeeting.getToken()) {
      values.text = ':(';
      values.color = comeetingConfig.BACK_GROUND.COLOR_RED;
      values.title = chrome.i18n.getMessage('not_authenticated');
    } else {
      values.text = unReadCount.toString();
      values.color = comeetingConfig.BACK_GROUND.COLOR_BLUE;
      values.title = chrome.i18n.getMessage('name');
    }

    chrome.browserAction.setBadgeText({
      text: values.text
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: values.color
    });
    chrome.browserAction.setTitle({
      title: values.title
    });
  };

  chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
    // 1分に一回updateする
    chrome.alarms.create('update', {
      periodInMinutes: comeetingConfig.BACK_GROUND.UPDATE_INTERVAL
    });
    update();
  });

  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm) {
      if (alarm.name === 'update') {
        update();
      }
    }
  });

})();
