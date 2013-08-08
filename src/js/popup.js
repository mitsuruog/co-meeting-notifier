(function() {
  var Popup, TEMPLATE_SRC, popup;

  TEMPLATE_SRC = '<li class="group">\n<% if(!unread_off && unread_counts){ %>\n<span class="group_unread_counts label label-info"><%- unread_counts %></span>\n<% } %>\n<a href="<%= url %>" class="group_link btn-link" target="_blank">\n<span class="group_name"><%- name %></span>\n</a>\n</li>';

  Popup = (function() {
    var bg;

    bg = chrome.extension.getBackgroundPage().bg;

    function Popup() {
      var _this = this;
      window.addEventListener("load", function() {
        _this.start();
      });
    }

    Popup.prototype.start = function() {
      this.assignMessages();
      this.render();
      this.assignEventHandlers();
    };

    Popup.prototype.tmpl = function(contents) {
      var tmpl;
      tmpl = _.template(TEMPLATE_SRC);
      return tmpl(contents);
    };

    Popup.prototype.render = function() {
      var $groupList, group, groupList, html, _group, _i, _len;
      $groupList = $(".groupList");
      if (!bg.isAuthenticated()) {
        $groupList.html(chrome.i18n.getMessage("no_one_authenticated"));
      }
      groupList = bg.getGroupInfo();
      html = "";
      for (_i = 0, _len = groupList.length; _i < _len; _i++) {
        group = groupList[_i];
        _group = this.convertToGroup(group);
        html += this.tmpl(_group);
      }
      $groupList.html(html);
    };

    Popup.prototype.assignMessages = function() {};

    Popup.prototype.assignEventHandlers = function() {};

    Popup.prototype.convertToGroup = function(group) {
      group.unread_counts = group.unread_counts || "";
      return group;
    };

    return Popup;

  })();

  popup = new Popup();

}).call(this);
