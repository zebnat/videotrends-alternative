import { Video, ProdVideoJSON, Thumb } from '../common/types'

export default class ProdjsonToVideoAdapter implements Video {
  private _prodJSON: ProdVideoJSON

  constructor(prodJSON: ProdVideoJSON) {
    this._prodJSON = prodJSON
  }

  get visible(): boolean {
    return this._prodJSON.v
  }

  set visible(value: boolean) {
    this._prodJSON.v = value
  }

  get title(): string {
    return this._prodJSON.t
  }

  get rating(): number {
    return this._prodJSON.r
  }

  get daysAgo(): number {
    return this._prodJSON.d
  }

  get thumb(): Thumb {
    return this._prodJSON.tm
  }

  get href(): string {
    return this._prodJSON.h
  }

  get categories(): string[] {
    return this._prodJSON.c
  }

  get subs(): number {
    return this._prodJSON.s
  }
}
