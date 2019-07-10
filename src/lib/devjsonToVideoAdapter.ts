import { Video, DevVideoJSON, Thumb } from '../common/types'

export default class DevjsonToVideoAdapter implements Video {
  private _devJSON: DevVideoJSON

  private _visible: boolean = false
  private _title: string = ''
  private _rating: number = 0
  private _daysAgo: number = 0
  private _thumb: Thumb = { height: 0, width: 0, url: '' }
  private _href: string = ''
  private _categories: string[] = []
  private _subs: number = 0

  private _videoId: string | undefined = undefined
  private _trendCategoryPosition: number | undefined = undefined
  private _status: any = undefined
  private _stats: any = undefined
  private _spam: number | undefined = undefined
  private _normalize: number[] = []
  private _lang: string | undefined = undefined
  private _details: any = undefined
  private _channelId: string | undefined = undefined
  private _categoryId: string | undefined = undefined

  constructor(devJSON: DevVideoJSON) {
    this._devJSON = devJSON
  }

  // no optional
  get visible(): boolean {
    this._visible = this._devJSON.visible
    return this._visible
  }

  set visible(value: boolean) {
    this._visible = value
  }

  get title(): string {
    this._title = this._devJSON.title
    return this._title
  }

  set title(value: string) {
    this._title = value
  }

  get rating(): number {
    this._rating = this._devJSON.rating
    return this._rating
  }

  set rating(value: number) {
    this._rating = value
  }

  get daysAgo(): number {
    this._daysAgo = this._devJSON.daysAgo
    return this._daysAgo
  }

  set daysAgo(value: number) {
    this._daysAgo = value
  }

  get thumb(): Thumb {
    this._thumb = this._devJSON.thumb
    return this._thumb
  }

  set thumb(value: Thumb) {
    this._thumb = value
  }

  get href(): string {
    this._href = this._devJSON.href
    return this._href
  }

  set href(value: string) {
    this._href = value
  }

  get categories(): string[] {
    this._categories = this._devJSON.categories
    return this._categories
  }

  set categories(value: string[]) {
    this._categories = value
  }

  get subs(): number {
    this._subs = this._devJSON.subs
    return this._subs
  }

  set subs(value: number) {
    this._subs = value
  }

  // optional

  get videoId(): string | undefined {
    this._videoId = this._devJSON.videoId
    return this._videoId
  }

  set videoId(value: string | undefined) {
    this._videoId = value
  }

  get trendCategoryPosition(): number | undefined {
    this._trendCategoryPosition = this._devJSON.trendCategoryPosition
    return this._trendCategoryPosition
  }

  set trendCategoryPosition(value: number | undefined) {
    this._trendCategoryPosition = value
  }

  get status(): any {
    this._status = this._devJSON.status
    return this._status
  }

  set status(value: any) {
    this._status = value
  }

  get stats(): any {
    this._stats = this._devJSON.stats
    return this._stats
  }

  set stats(value: any) {
    this._stats = value
  }

  get spam(): number | undefined {
    this._spam = this._devJSON.spam
    return this._spam
  }

  set spam(value: number | undefined) {
    this._spam = value
  }

  get normalize(): number[] {
    this._normalize = this._devJSON.normalize
    return this._normalize
  }

  set normalize(value: number[]) {
    this._normalize = value
  }

  get lang(): string | undefined {
    this._lang = this._devJSON.lang
    return this._lang
  }

  set lang(value: string | undefined) {
    this._lang = value
  }

  get details(): any {
    this._details = this._devJSON.details
    return this._details
  }

  set details(value: any) {
    this._details = value
  }

  get channelId(): string | undefined {
    this._channelId = this._devJSON.channelId
    return this._channelId
  }

  set channelId(value: string | undefined) {
    this._channelId = value
  }

  get categoryId(): string | undefined {
    this._categoryId = this._devJSON.categoryId
    return this._categoryId
  }

  set categoryId(value: string | undefined) {
    this._categoryId = value
  }
}
