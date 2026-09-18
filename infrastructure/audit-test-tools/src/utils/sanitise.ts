export const sanitise = (value: unknown): string => {
  if (value === undefined || value === null) return ''
  // eslint-disable-next-line no-control-regex
  return String(value).replace(/[\r\n\t\x00-\x1f\x7f]/g, '')
}
