import type { SerializeContext } from './src/dts/serialize/serialize'

import { DataSourceGitlabFile } from './src/data-source/data-source-gitlab-file'
import { DtsFile } from './src/dts/file'
import { MutatorType } from './src/dts/enum/mutator-type'
import { Serialize } from './src/dts/serialize/serialize'

import camelCase from 'lodash.camelcase'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import * as prettier from "prettier"

dotenv.config()

function getFullType(pckg: string, src: string) {

  if (src.match(/^(entity|service|struct|typed_value)/)) {
    return src
  }

  const path = pckg.replace(new RegExp('\.' + src + '$', 'i'), '')

  return `${path}.${src}`
}

function getNamespaceName(src: string, context: SerializeContext) {

  const commonRe = /^common\./

  let chunks: string[] = (
      commonRe.test(src)
        ? src // передан абсолютный путь
        : getFullType(context.package, src) // передан относительный путь
    )
    .replace(commonRe, '')
    .split('.')

  return camelCase(
    chunks
      .filter((node) => node !== 'common')
      .join('_')
  ).replace(/^(.)(.*)$/, ($0, $1, $2) => {
    return `${$1.toUpperCase()}${$2}`
  })
}

export function getTargetFilePath(value: string) {
  return value
    .replace(/^\.\//, '')
    .replace(/\//g, '_')
    .replace(/\.proto$/, '.d.ts')
}

Serialize.addMutationRule(MutatorType.VariableName, (value) => {
  return camelCase(value)
})

Serialize.addMutationRule(MutatorType.VariableType, (value, context) => {
  const map: Record<string, string> = {
    'google.protobuf.Any': 'any',
    'google.protobuf.Empty': 'any',
    'google.protobuf.Timestamp': 'string',
    bool: 'boolean',
    bytes: 'string',
    int32: 'number',
    uint32: 'number'
  }

  if (map[value]) {
    return map[value]
  }

  if (value.match('.')) {
    const chunks = value.split('.')

    if (chunks.length > 1) {
      const type = chunks.pop()
      const ns = getNamespaceName(chunks.join('.'), context)

      return `${ns}.${type}`
    }

  }

  return value
})

Serialize.addMutationRule(MutatorType.PackageNameToNamespace, (value, context) => {
  return getNamespaceName(value, context)
})

let files = [
  'proto/service/protocol/external.proto',
  'proto/service/protocol/internal.proto',
  'proto/service/pre_qualification/external.proto',
  'proto/service/auth/external.proto'
]

let done: string[] = []

try {
  while (files.length) {
    const file = files.shift()
  
    if (!file) {
      break
    }

    console.log(`processing: ${file}`)
  
    const dts = new DtsFile()
    const result = dts.parse(new DataSourceGitlabFile(file))
  
    if (result.source) {
      done.push(file)

      prettier.format(result.source, {
        "trailingComma": "none",
        "singleQuote": true,
        "parser": "typescript"
      }).then((content) => {
        fs.writeFileSync(path.resolve(__dirname, './types/', getTargetFilePath(file)), content)
      })
    }

    result.imports.forEach((path) => {
      if (done.indexOf(path) !== -1) {
        console.log(`skip as processed: ${path}`)
        return
      }

      if (path.match(/^google\/(protobuf|api)/)) {
        console.log(`skip as internal proto file: ${path}`)
        return
      }

      files.push(path)
    })
  }
} catch (e) {
  console.log(e)
}

