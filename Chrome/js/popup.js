!(function () {
	'use strict';

	var templateString = '' +
		'<li class="group">' +
		'<span class="group_unread_counts label label-info"><%- unread_counts %></span>' +
		'<a href="<%= url %>" class="group_link btn-link" target="_blank">' +
		'<span class="group_name"><%- name %></span>' +
		'</a>' +
		'</li>';

	var comeetingNotifier = new ComeetingNotifier();
	var tmpl = _.template(templateString);
	var $groupList = $('.groupList');

	//popup.htmlにリストを表示
	render();

	function render() {

		var groupList = comeetingNotifier.getGroupList();
		var html = '';

		_.each(groupList, function (group) {
			group.unread_counts = group.unread_counts || '';
			html += tmpl(group);
		});

		$groupList.html(html);

	}

})();