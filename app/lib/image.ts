const KNOWN_IMAGE_TYPE = ['jpeg', 'png', 'gif']

export function dataURLtoFile(dataurl: string, filename?: string): File | null {
  // check data url
  if (!isDataURL(dataurl)) return null

  const arr = dataurl.split(',')
  const match = arr[0].match(/:(.*?);/)

  if (!match) return null
  const mime = match[1]

  const ext = getExt(mime)
  const fileNameBase = filename ?? getRandomFileName()
  const name = fileNameBase + '.' + ext

  const bstr = atob(arr[arr.length - 1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], name, { type: mime })
}

// https://gist.github.com/bgrins/6194623
// https://gist.github.com/khanzadimahdi/bab8a3416bdb764b9eda5b38b35735b8
function isDataURL(s: string): boolean {
  const regex = /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[\w\W]*?[^;])*),(.+)$/
  return !!s.match(regex)
}

function getExt(mimeType: string): string | null {
  const arr = mimeType.split('/')
  // 画像かどうか
  if (arr[0] !== 'image') return null
  const ext = arr[1]
  // jpeg, png, gif のいずれか
  if (!KNOWN_IMAGE_TYPE.some((t) => t === ext)) return null
  return ext
}

function getRandomFileName(): string {
  const uuid = crypto.randomUUID()
  return uuid
}
