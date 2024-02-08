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
