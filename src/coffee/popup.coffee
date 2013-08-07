# @fileoverview Make the group list when call from browser action triggered.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/popup.coffee

# TODO unread_offの場合はなにかアイコンとか出す
TEMPLATE_SRC = '''
                <li class="group">
                <% if(!unread_off && unread_counts){ %>
                <span class="group_unread_counts label label-info"><%- unread_counts %></span>
                <% } %>
                <a href="<%= url %>" class="group_link btn-link" target="_blank">
                <span class="group_name"><%- name %></span>
                </a>
                </li>
                '''
class Popup

  bg = chrome.extension.getBackgroundPage().bg
  comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier

  constructor: ->
    window.addEventListener "load", =>
      @start()
      return

  start: ->
    @assignMessages()
    @render()
    @assignEventHandlers()
    return

  tmpl: (contents) ->
    tmpl = _.template TEMPLATE_SRC
    tmpl contents

  render: ->
    $groupList = $ ".groupList"

    if not comeetingNotifier.isAuthenticated()
      #TODO no accounts connected
      $groupList.html chrome.i18n.getMessage "no_one_authenticated"

    groupList = comeetingNotifier.groupList.get()
    html = ""

    for group in groupList
      _group = @setGroup group
      html += @tmpl _group

    $groupList.html html
    return

  assignMessages: ->

  assignEventHandlers: ->

  setGroup: (group) ->
    group.unread_counts = group.unread_counts || ""
    group

popup = new Popup()