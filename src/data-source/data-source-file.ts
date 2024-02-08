import fs from 'fs'

import { DataSourceStringArray } from './data-source-string-array'

export class DataSourceFile extends DataSourceStringArray {
  constructor(path: string) {
    const tokens = fs.readFileSync(path)
      .toString()
      .split('')

    super(tokens)
  }
}