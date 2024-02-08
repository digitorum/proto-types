import { DataSourceStringArray } from './data-source-string-array'

import { spawnSync } from 'node:child_process'

export class DataSourceGitlabFile extends DataSourceStringArray {
  constructor(path: string) {
    const token = process.env['GITLAB-PRIVATE-TOKEN']
    const origin = process.env['GITLAB-ORIGIN']
    const result = spawnSync('curl', ['--connect-timeout', '5', '--header', `PRIVATE-TOKEN: ${token}`, `${origin}/api/v4/projects/609/repository/files/${encodeURIComponent(path)}/raw`])

    let arr: string[] = []

    if (result.status !== 0) {
      throw new Error('Failed to fetch')
    } else {
      arr = result.stdout.toString()
        .toString()
        .split('')
    }

    super(arr)
  }

}
