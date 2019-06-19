import * as dotenv from 'dotenv'
import { IConfig, App } from './src/App'

dotenv.config()

let cache: boolean = true

process.argv.forEach(v => {
  if (v == '--nocache') cache = false
})

const config: IConfig = {
  apikey: process.env.YOUTUBEAPI,
  cache: cache,
  regionList: [
    { language: 'es', country: 'es' },
    { language: 'en', country: 'us' },
    { language: 'fr', country: 'fr' },
    { language: 'de', country: 'de' },
    { language: 'nl', country: 'nl' },
    { language: 'it', country: 'it' },
    { language: 'en', country: 'gb' },
    { language: 'es', country: 'ar' },
    { language: 'es', country: 'mx' },
    { language: 'es', country: 'cl' },
    { language: 'zh', country: 'hk' },
    { language: 'ar', country: 'qa' },
    { language: 'ar', country: 'kw' },
    { language: 'ja', country: 'jp' },
    { language: 'ko', country: 'kr' },
  ],
}

const app = new App(config)

app.run()
