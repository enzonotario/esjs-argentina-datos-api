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

```js eval code=false
year = Inputs.select([
  ...Array.from({ length: new Date().getFullYear() - 1983 + 1 }, (_, i) => 1983 + i).reverse()
], { label: "Año" });
```

### Distribución de votos por acta

```js eval code=false
(async () => {
  const colors = await getColors();
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

## Actas por resultado

```js eval code=false
(async () => {
  const actas = await getData();
  const colors = await getColors();

  const data = [...new Set(actas.map(d => d.resultado))].map(resultado => ({
    resultado,
    cantidad: actas.filter(d => d.resultado === resultado).length,
  }));

  return Plot.plot({
    width,
    marginLeft: 150,
    marks: [
      Plot.barX(data, {
        y: "resultado",
        x: "cantidad",
        title: d => `${d.resultado}: ${d.cantidad}`,
        tip: {
          fill: dark ? colors.gray[900] : colors.gray[100],
          stroke: dark ? colors.gray[700] : colors.gray[300],
        },
        sort: {
          y: "-x",
        }
      }),
    ],
    x: { label: "Resultado" },
    y: { label: "Cantidad de actas" }
  });
})()
```

## Árbol de actas

```js eval code=false
(async () => {
  const actas = await getData();

  const paths = actas.map(acta => `Actas/${acta.resultado}/${acta.titulo}`);

  return Plot.plot({
    axis: null,
    width,
    marginTop: 50,
    marginBottom: 50,
    marginRight: 200,
    marginLeft: 30,
    marks: [
      Plot.tree(paths, {
        delimiter: "/",
        textStroke: "none",
        dot: true
      })
    ],
  });
})()
```

## Presentismo por acta

```js eval code=false
(async () => {
  const actas = await getData();
  const colors = await getColors();

  const data = actas.map(acta => ({
    actaId: acta.actaId,
    titulo: acta.titulo,
    presentismo: acta.presentes / acta.miembros,
    presentismoPorcentaje: Number(((acta.presentes / acta.miembros) * 100).toFixed(2)),
  }));

  return Plot.plot({
    width,
    marginLeft: 50,
    marginBottom: 50,
    color: {
      type: "linear",
      scheme: 'RdBu',
    },
    marks: [
      Plot.dot(data, {
        x: "actaId",
        y: "presentismoPorcentaje",
        title: d => `${d.titulo}: ${d.presentismoPorcentaje}%`,
        fill: "presentismoPorcentaje",
        size: 7,
        stroke: dark ? colors.blue[300] : colors.blue[700],
        strokeWidth: 1,
        tip: {
          fill: dark ? colors.gray[900] : colors.gray[100],
          stroke: dark ? colors.gray[700] : colors.gray[300],
        },
      }),
    ],
    x: { label: "Acta" },
    y: { label: "Presentismo" }
  });
})()
```
