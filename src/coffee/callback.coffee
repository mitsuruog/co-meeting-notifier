# @fileoverview Save to localstorage token when redirecting.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/callback.caffee

class Callback

  bg = chrome.extension.getBackgroundPage().bg

  constructor: ->
    window.addEventListener "load", =>
      @start()
      return

  start: ->
    @assignMessages()
    @assignEventHandlers()
    return

  assignMessages: ->

    $(".authenticated-message").find('>h3').text(chrome.i18n.getMessage "authenticated").end()
      .find(".js-authenticated-close").text(chrome.i18n.getMessage "close")

    return

  assignEventHandlers: ->

    if not location.href.match(/code=(\S*)/)
      throw new Error "Authorization Code is empty"

    code = location.href.match(/code=(\S*)/)[1]
    #accessToken取得
    bg.getAccessToken code

    #250ms後に自動で閉じる
    setTimeout ->
      chrome.tabs.getCurrent (tab) ->
        chrome.tabs.remove tab.id, ->
        return
      return
    , 250

    #閉じなかった時のための保険
    $(".js-authenticated-close").on "click", (e) =>
      e.preventDefault()
      chrome.tabs.getCurrent (tab) ->
        chrome.tabs.remove tab.id, ->
        return
      return
    return

callback = new Callback()
