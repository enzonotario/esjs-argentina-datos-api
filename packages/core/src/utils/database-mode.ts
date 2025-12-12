export function shouldWriteJsonFiles(): boolean {
  const mode = process.env.VITE_DATABASE_MODE || 'sqlite-only'
  return mode === 'hybrid'
}

export function shouldWriteFromDatabase(): boolean {
  const mode = process.env.VITE_DATABASE_MODE || 'sqlite-only'
  return mode === 'sqlite-only' || mode === 'hybrid'
}


