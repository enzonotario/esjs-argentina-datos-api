import { titleCase } from 'title-case'

export const SENTENCE_TERMINATORS = new Set(['.', '!', '?'])

export const SPANISH_SMALL_WORDS = new Set([
  'a',
  'al',
  'como',
  'con',
  'de',
  'del',
  'desde',
  'durante',
  'e',
  'el',
  'en',
  'entre',
  'hacia',
  'hasta',
  'la',
  'las',
  'le',
  'les',
  'lo',
  'los',
  'mediante',
  'ni',
  'o',
  'para',
  'pero',
  'por',
  'según',
  'sin',
  'so',
  'sobre',
  'tras',
  'u',
  'un',
  'una',
  'unas',
  'unos',
  'versus',
  'via',
  'vs',
  'y',
])

export interface Options {
  locale?: string | string[]
  sentenceCase?: boolean
  sentenceTerminators?: Set<string>
  smallWords?: Set<string>
  titleTerminators?: Set<string>
  wordSeparators?: Set<string>
}

export function titleCaseSpanish(
  input: string,
  options: Options | string[] | string = {},
) {
  const baseOptions: Options = {
    locale: 'es',
    sentenceCase: false,
    smallWords: SPANISH_SMALL_WORDS,
    sentenceTerminators: SENTENCE_TERMINATORS,
    titleTerminators: SENTENCE_TERMINATORS,
  }

  const mergedOptions
    = typeof options === 'string' || Array.isArray(options)
      ? { ...baseOptions, locale: options }
      : { ...baseOptions, ...options }

  return titleCase(input, mergedOptions)
}
