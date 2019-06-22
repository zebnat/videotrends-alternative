import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { RegionList } from '../src/config/config'
import { App, IConfig } from './src/App'

dotenv.config()

let cache: boolean = true
if (process.env.CACHE === 'NO') {
  cache = false
}

const config: IConfig = {
  apikey: process.env.YOUTUBEAPI,
  cache: cache,
  regionList: RegionList,
  cacheFiles: {
    categories: resolve('./cache/categories.json'),
    videos: resolve('./cache/videos.json'),
  },
}

const app = new App(config)

app.run()
