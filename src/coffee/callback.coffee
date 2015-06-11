# @fileoverview Save to localstorage token when redirecting.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/callback.caffee

class Callback

  constructor: ->
    window.addEventListener "load", =>
      @start()

  start: ->
    @assignMessages()
    @assignEventHandlers()
    return

  assignMessages: ->
    return

  assignEventHandlers: ->

    if not location.href.match(/code=(\S*)/)
      throw new Error "Authorization Code is empty"

    code = location.href.match(/code=(\S*)/)[1]

    #accessToken取得
    window.comeetingNotifier.claimAccessToken code, () ->
      console.log "claimAccessToken :)"
      window.comeetingNotifier.fetchMe () ->
        console.log "fetchMe :)"
        window.close()

    #閉じなかった時のための保険
    $(".js-authenticated-close").on "click", (e) =>
      e.preventDefault()
      window.close()
    return

callback = new Callback()
