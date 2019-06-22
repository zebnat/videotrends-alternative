export function splitArrayInChunks(
  array: string[],
  chunkSize: number
): any {
  let chunkS = chunkSize || 10
  let groups = array
    .map(function(_e, i) {
      return i % chunkS === 0
        ? array.slice(i, i + chunkS)
        : null
    })
    .filter(e => e)
  return groups
}

export function UrlParamEncoder(data: object) {
  let str: string
  let params = []

  for (let x in data) {
    params.push(x + '=' + data[x])
  }

  return encodeURI(params.join('&'))
}
