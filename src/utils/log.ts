import colors from 'cli-color'

type TColorsApplieble<T> = {
  [K in keyof T]: T[K] extends (arg: string) => string
    ? K
    : never
}[keyof T]

const colorsMap: Record<
  string,
  TColorsApplieble<colors.Format>
> = {
  double: 'yellow',
  error: 'red',
  info: 'white',
  parsed: 'green',
  skip: 'blueBright',
  waiting: 'yellowBright'
}

/**
 * Вывод тукста с предопределенным цветом для типа сообщения
 *
 * @param type 
 * @param text 
 */
export function log(type: string, text: string) {
  const prefix = `[${type}]:`.padEnd(10, ' ')
  const color = colorsMap[type] ?? 'white'

  console.log(colors[color](`${prefix} ${text}`))
}
