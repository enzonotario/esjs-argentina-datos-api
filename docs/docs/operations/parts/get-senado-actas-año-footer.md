## Ejemplos de uso

```js eval code=false inspector=false
async function getColors() {
  return fetch('https://api.argentinadatos.com/static/colors.json').then(res => res.json());
}
```

```js eval code=false inspector=false
async function getData() {
  const data = await fetch(`https://api.argentinadatos.com/v1/senado/actas/${year}`).then(res => res.json());

  return data
}
```

### Distribución de votos por acta

```js eval code=false
year = Inputs.select([
  ...Array.from({ length: new Date().getFullYear() - 1983 + 1 }, (_, i) => 1983 + i).reverse()
], { label: "Año" });
```

```js eval code=false
(async () => {
  const colors = await getColors();
  console.log(colors)
  const actas = await getData();
  const colorsMap = {
    afirmativos: {
      dark: colors.teal[400],
      light: colors.teal[600],
    },
    negativos: {
      dark: colors.red[400],
      light: colors.red[600],
    },
    abstenciones: {
      dark: colors.gray[400],
      light: colors.gray[600],
    },
  }

  const votos = actas.flatMap(acta => [
    {
      actaId: acta.actaId,
      titulo: acta.titulo,
      tipo: "Afirmativos",
      cantidad: acta.afirmativos,
      fill: dark ? colorsMap.afirmativos.dark : colorsMap.afirmativos.light,
    },
    {
      actaId: acta.actaId,
      titulo: acta.titulo,
      tipo: "Negativos",
      cantidad: acta.negativos,
      fill: dark ? colorsMap.negativos.dark : colorsMap.negativos.light,
    },
    {
      actaId: acta.actaId,
      titulo: acta.titulo,
      tipo: "Abstenciones",
      cantidad: acta.abstenciones,
      fill: dark ? colorsMap.abstenciones.dark : colorsMap.abstenciones.light,
    }
  ]);

  return Plot.plot({
    width,
    marginLeft: 50,
    marginBottom: 50,
    marks: [
      Plot.barY(votos, {
        x: "actaId",
        y: "cantidad",
        fill: "fill",
        stack: true,
        title: d => `${d.tipo}: ${d.cantidad}`,
        tip: {
          fill: dark ? colors.gray[900] : colors.gray[100],
          stroke: dark ? colors.gray[700] : colors.gray[300],
        },
      }),
    ],
    x: { label: "Acta", tickRotate: -30 },
    y: { label: "Cantidad de votos" }
  });
})()

```

