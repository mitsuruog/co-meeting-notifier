$(function() {
  'use strict';

  var groupList = document.querySelector('.groupList');
  var template = document.querySelector('#tmplGroup');

  var render = function(groups) {

    if(groups === null) {
      groupList.textContent = chrome.i18n.getMessage('no_one_authenticated');
      return;
    }

    groups.forEach(function(group) {
      console.log(group);
      var groupUnreadCount = template.content.querySelector('.group-unread-count');
      var groupName = template.content.querySelector('.group-name');
      var groupLink = template.content.querySelector('.group-link');

      // 未読数がある場合はラベルを表示する
      if(!group.unread_off && group.unread_counts) {
        groupUnreadCount.textContent = group.unread_counts;
        groupUnreadCount.classList.add('label');
        groupUnreadCount.classList.add('label-info');
      }

      groupName.textContent = group.name;
      groupLink.href = group.url;

      var clone = document.importNode(template.content, true);
      groupList.appendChild(clone);
    });

  };
  window.comeeting.getGroupInfo().then(function(groups) {
    render(groups);
  });

});
