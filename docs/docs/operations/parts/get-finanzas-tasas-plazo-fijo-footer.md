## Ejemplos de uso

```js eval code=false inspector=false
async function getData() {
  const data = await fetch('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo').then((res) => res.json())

  return data.map((d) => ({
    entidad: d.entidad,
    tnaClientes: Number((d.tnaClientes * 100).toFixed(2)),
    tnaNoClientes: d.tnaNoClientes ? Number((d.tnaNoClientes * 100).toFixed(2)) : null,
  }))
}
```

```js eval code=false inspector=false
const tipos = [
  { value: 'tnaClientes', label: 'Clientes' },
  { value: 'tnaNoClientes', label: 'No Clientes' },
]
```

```js eval code=false
tipo = Inputs.radio(tipos, {
  value: tipos[0],
  label: 'Tipo de tasa',
  format: (x) => x.label,
})
```

```js eval code=false
(async () => {
  const data = await getData()

  return Plot.plot({
    width,
    marginLeft: width / 2,
    color: { scheme: 'PuBuGn' },
    marks: [
      Plot.barX(data, {
        x: tipo ? tipo.value : 'tnaClientes',
        y: 'entidad',
        sort: {
          y: '-x',
        },
        fill: tipo ? tipo.value : 'tnaClientes',
        tip: {
          format: {
            x: (d) => `TNA: ${d}%`,
          },
        },
      }),
    ],
  })
})()
```
