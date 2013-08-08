# @fileoverview Make the option page.
# @copyright mitsuruog 2013
# @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
# @license MIT
#
# @module js/options.coffee

TEMPLATE_SRC = '''
               <div class="row account">
               <div class="col-lg-2 account-avatar"><img src="<%=icon_url%>" class="img-circle"></div>
               <div class="col-lg-3 account-name"><%-name%>(<%-screen_name%>)</div>
               <div class="col-lg-2 account-button"></div>
               </div>
               '''

class Options

  bg = chrome.extension.getBackgroundPage().bg

  constructor: ->
    window.addEventListener "load", =>
      @start()
      return

  start: ->
    @assignMessages()
    @render()
    @assignEventHandlers()
    return

  render: ->
    isAuthenticated = bg.isAuthenticated()
    $(".js-btn-addAccount").prop "disabled", isAuthenticated
    $(".js-btn-disable").prop "disabled", not isAuthenticated

    if isAuthenticated
      $(".account-list").html _.template TEMPLATE_SRC, bg.getAccountInfo()
    else
      $(".account-list").html ""

    return

  assignMessages: ->
   return

  assignEventHandlers: =>

    $(".js-btn-addAccount").on "click", (e) =>
      e.preventDefault()
      bg.authorization()
      setTimeout =>
        @render()
      , 5000
      return

    $(".js-btn-disable").on "click", (e) =>
      e.preventDefault()
      bg.disableAuthorization()
      @render()
      return

    return

options = new Options()

