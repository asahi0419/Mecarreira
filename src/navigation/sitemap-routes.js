import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Route } from 'react-router'

export default (
  <Route>
    <Route path="/" />
    <Route path="/signup" />
    <Route path="/player-dashboard" />
    <Route path="/referral/:id" />
    <Route path="/invite/:id" />
    <Route path="/genesis" />
    <Route path="/files/:fileName" />
    <Route path="/otp-whatsapp" />
    <Route path="/user-otp-whatsapp" />
    <Route path="/app" />
    <Route path="/app/player/:id" />
    <Route path="/app/player-dashboard" />
    <Route path="/app/notifications" />
    <Route path="/app/notifications_settings" />
    <Route path="/app/my_settings" />
    <Route path="/app/my_items" />
    <Route path="/app/my_watchlist" />
    <Route path="/app/staked" />
    <Route path="/app/tutorials" />
    <Route path="/app/player-share" />
    <Route path="/app/player/share/:id" />
    <Route path="/app/accounts/resetPassword/:uid/:token" />
    <Route path="/app/wallet" />
    <Route path="/app/all-players" />
    <Route path="/app/fan-player-dashboard" />
    <Route path="/app/draft_new_player" />
    <Route path="/app/draft_confirmation" />
    <Route path="/app/confirm_go_live" />
    <Route path="/app/how-it-works" />
    <Route path="/app/kiosk" />
    <Route path="/app/scouts" />
    <Route path="/app/launch-your-coin" />
    <Route path="/app/launch-options" />
    <Route path="/app/user/:name" />
    <Route path="/app/all-users" />
    <Route path="/app/season/:id" />
    <Route path="/app/get-early-access" />
    <Route path="/app/language" />
    <Route path="/app/menu" />
    <Route path="/app/kiosk/:id/:hash" />
    <Route path="/app/invite/:id" />
    <Route path="/app/freeXp" />
    <Route path="/app/nft/:ticker/:id" />
    <Route path="/app/signup" />
    <Route path="/app/otp-whatsapp" />
    <Route path="/app/user-otp-whatsapp" />
    <Route path="/app/accounts/verify/email/:refreshToken/:jwtToken" />
    <Route path="/app/accounts/resetPassword/:uid/:token" />
    <Route path="/app/accounts/changePassword" />
    <Route path="/app/kiosk_category_items/:id" />
    <Route path="/blog" />
    <Route path="/blog/:slug" />
    <Route path="/faqs" />
    <Route path="/terms-conditions" />
    <Route path="/privacy-policy" />
    <Route path="/cookie-policy" />
    <Route path="/disclaimer" />
    <Route path="/careers" />
    <Route path="/contact-us" />
  </Route>
)
