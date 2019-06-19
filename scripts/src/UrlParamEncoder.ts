export default function UrlParamEncoder(data: object) {
  let str: string
  let params = []

  for (let x in data) {
    params.push(x + '=' + data[x])
  }

  return encodeURI(params.join('&'))
}
