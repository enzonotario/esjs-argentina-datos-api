import { globSync } from 'glob'
import { transpile } from '@es-js/core'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'

function convert(reverse = false) {
  const extension = reverse ? '.esjs' : '.esjs'
  const newExtension = reverse ? '.esjs' : '.esjs'

  // Por cada archivo `${extension}` en la carpeta `api`, de manera recursiva:
  //   - Obtener el contenido del archivo
  //   - Aplicar `transpile`
  //   - Guardar el resultado en el archivo `${extension}`

  const files = globSync(`api/**/*${extension}`)

  files.forEach((file) => {
    const content = readFileSync(file, 'utf-8')
    const result = transpile(content)
    const newFile = join(file.slice(0, file.lastIndexOf('.')) + newExtension)
    writeFileSync(
        newFile,
        transpile(content, reverse)
    )
    unlinkSync(file)
  })
}

const reverse = process.argv.includes('--reverse')

convert(reverse)
