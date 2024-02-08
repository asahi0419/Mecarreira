require('babel-register')({
  presets: ['es2015', 'react'],
})

// const privateRouter = require('./sitemap-routeszero').default
// const appRouter = require('./sitemap-routes-app').default
const mainRouter = require('./sitemap-routes').default
const Sitemap = require('react-router-sitemap').default

function generateSitemapMain() {
  return new Sitemap(mainRouter)
    .build(process.env.REACT_APP_LANDING_URL)
    .save('./public/sitemap.xml')
}

generateSitemapMain()

// function generateSitemapApp() {
//   return new Sitemap(appRouter)
//     .build('https://devapp.mecarreira.com/')
//     .save('./public/appsitemap.xml')
// }

// function generateSitemapPrivate() {
//   return new Sitemap(privateRouter)
//     .build('https://devlanding.mecarreira.com/')
//     .save('./public/sitemap.xml')
// }

// generateSitemapPrivate()
// generateSitemapApp()
