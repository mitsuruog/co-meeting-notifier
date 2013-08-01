# @fileoverview Save to localstorage token when redirecting.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/callback.caffee

class Callback

  bg = chrome.extension.getBackgroundPage().bg
  comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier

  constructor: ->
    window.addEventListener "load", =>
      @start()
      return

  start: ->
    @assignMessages()
    @assignEventHandlers()
    return

  assignMessages: ->
    if not location.href.match(/code=(\S*)/)
      throw new Error "Authorization Code is empty"

    code = location.href.match(/code=(\S*)/)[1]
    #accessToken取得
    comeetingNotifier.claimAccessToken code, bg.fetch
    return

  assignEventHandlers: ->
    $(".js-authenticated-close").on "click", (e) =>
      e.preventDefault()
      chrome.tabs.getCurrent (tab) ->
        chrome.tabs.remove tab.id, ->
          return
        return
      return
    return

callback = new Callback()
