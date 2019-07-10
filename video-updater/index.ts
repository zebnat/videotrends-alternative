import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { RegionList } from '../src/config/config'
import { App, Config } from './src/App'

dotenv.config()

let cache: boolean = true
if (process.env.CACHE === 'NO') {
  cache = false
}

let prodReady: boolean = false
if (process.env.PROD === 'YES') {
  prodReady = true
}

const config: Config = {
  apikey: process.env.YOUTUBEAPI,
  cache: cache,
  prodReady: prodReady,
  regionList: RegionList,
  cacheFiles: {
    categories: resolve('./cache/categories.json'),
    videos: resolve('./cache/videos.json'),
  },
}

const app = new App(config)

app.run()
