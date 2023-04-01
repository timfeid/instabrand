const colors = [
  '#C7115A',
  '#9F4576',
  '#006853',
  '#6C17A6',
  '#255FD1',
  '#00778F',
  '#D9461A',
  '#475E69',
]

function getColor(firstName: string, lastName: string) {
  const initialF = firstName[0] || ''
  const initialL = lastName[0] || ''
  const seed = [initialF, initialL]
    .filter(Boolean)
    .map(c => c.toLowerCase().charCodeAt(0) - 97)
    .reduce((a, b) => a + b, 0)

  return colors[seed % colors.length] || '#C7115A'
}

export function getAvatarByName(options: {
  firstName: string
  lastName: string
  rounded?: boolean
  color?: string
  bold?: boolean
  size?: number | string
  'font-size'?: string
  format?: string
}) {
  const background = getColor(options.firstName, options.lastName).substring(1)
  const name = `${options.firstName ? options.firstName[0] : ''}${
    options.lastName ? options.lastName[0] : ''
  }`

  const params = {
    background,
    name,
    color: options.color || 'fff',
    rounded: JSON.stringify(options.rounded || false),
    bold: JSON.stringify(options.bold || true),
    size: (options.size || 64).toString(),
    'font-size': options['font-size'] || '0.33',
    format: options.format || 'svg',
  }

  return `https://eu.ui-avatars.com/api/?` + new URLSearchParams(params).toString()
}
