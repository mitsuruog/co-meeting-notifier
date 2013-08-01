# @fileoverview Main module include interval for fetch unread counts.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/background.coffee

UPDATE_INTERVAL = 1000 * 60

class Background

  constructor: ->
    @assignEventHandlers()
    setInterval @fetch, UPDATE_INTERVAL

  assignEventHandlers: ->
    chrome.browserAction.onClicked.addListener ->
      if not comeetingNotifier.isAuthenticated()
        window.open comeetingNotifier.getAuthorizationUrl()
      else
        chrome.browserAction.setPopup
          popup: "popup.html"
      return

  render: (badge, color, title) ->
    chrome.browserAction.setBadgeText
      text: badge
    chrome.browserAction.setBadgeBackgroundColor
      color: color
    chrome.browserAction.setTitle
      title: title
    return

  fetch: =>
    comeetingNotifier.fetchUnreadCount (unreadCount) =>
      if unreadCount? > 0
        @render "" + unreadCount, [65, 131, 196, 255], "co-meetiong Notifier"
      else if unreadCount is 0
        @render "", [65, 131, 196, 255], "co-meetiong Notifier"
      else
        @render ":(", [166, 41, 41, 255], "You have to be connected to the internet and logged into co-meetiong"
      return
    return

window.bg = new Background()
window.bg.fetch()