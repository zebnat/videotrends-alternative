import { Video, ProdVideoJSON, Thumb } from '../common/types'

export default class ProdjsonToVideoAdapter implements Video {
  private _prodJSON: ProdVideoJSON

  private _visible: boolean = true
  private _title: string = ''
  private _rating: number = 0
  private _daysAgo: number = 0
  private _subs: number = 0
  private _thumb: Thumb = { height: 0, url: '', width: 0 }
  private _href: string = ''
  private _categories: string[] = []

  constructor(prodJSON: ProdVideoJSON) {
    this._prodJSON = prodJSON
  }

  get visible(): boolean {
    this._visible = this._prodJSON.v
    return this._visible
  }
  set visible(value: boolean) {
    this._visible = value
  }

  get title(): string {
    this._title = this._prodJSON.t
    return this._title
  }

  set title(value: string) {
    this._title = value
  }

  get rating(): number {
    this._rating = this._prodJSON.r
    return this._rating
  }

  set rating(value: number) {
    this._rating = value
  }

  get daysAgo(): number {
    this._daysAgo = this._prodJSON.d
    return this._daysAgo
  }

  set daysAgo(value: number) {
    this._daysAgo = value
  }

  get thumb(): Thumb {
    this._thumb = this._prodJSON.tm
    return this._thumb
  }

  set thumb(value: Thumb) {
    this._thumb = value
  }

  get href(): string {
    this._href = this._prodJSON.h
    return this._href
  }

  set href(value: string) {
    this._href = value
  }

  get categories(): string[] {
    this._categories = this._prodJSON.c
    return this._categories
  }

  set categories(value: string[]) {
    this._categories = value
  }

  get subs(): number {
    this._subs = this._prodJSON.s
    return this._subs
  }

  set subs(value: number) {
    this._subs = value
  }
}
