import { Video, DevVideoJSON, Thumb } from '../common/types'

export default class DevjsonToVideoAdapter implements Video {
  private _devJSON: DevVideoJSON

  constructor(devJSON: DevVideoJSON) {
    this._devJSON = devJSON
  }

  // no optional
  get visible(): boolean {
    return this._devJSON.visible
  }

  set visible(value: boolean) {
    this._devJSON.visible = value
  }

  get title(): string {
    return this._devJSON.title
  }

  get rating(): number {
    return this._devJSON.rating
  }

  get daysAgo(): number {
    return this._devJSON.daysAgo
  }

  get thumb(): Thumb {
    return this._devJSON.thumb
  }

  get href(): string {
    return this._devJSON.href
  }

  get categories(): string[] {
    return this._devJSON.categories
  }

  get subs(): number {
    return this._devJSON.subs
  }

  // optional

  get videoId(): string | undefined {
    return this._devJSON.videoId
  }

  get trendCategoryPosition(): number | undefined {
    return this._devJSON.trendCategoryPosition
  }

  get status(): any {
    return this._devJSON.status
  }

  get stats(): any {
    return this._devJSON.stats
  }

  get spam(): number | undefined {
    return this._devJSON.spam
  }

  get normalize(): number[] {
    return this._devJSON.normalize
  }

  get lang(): string | undefined {
    return this._devJSON.lang
  }

  get details(): any {
    return this._devJSON.details
  }

  get channelId(): string | undefined {
    return this._devJSON.channelId
  }

  get categoryId(): string | undefined {
    return this._devJSON.categoryId
  }
}
