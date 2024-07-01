export function scrollTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }
}
