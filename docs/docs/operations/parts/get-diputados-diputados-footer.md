## Ejemplos de uso

```js eval code=false inspector=false
async function getColors() {
  return fetch('https://api.argentinadatos.com/static/colors.json').then(res => res.json());
}
```

```js eval code=false inspector=false
async function getData() {
  const data = await fetch('https://api.argentinadatos.com/v1/diputados/diputados').then((res) => res.json())

  return data
}
```

### Diputados en funciones por bloque

```js eval code=false
(async () => {
  const diputados = (await getData())
    .filter(item => {
      return new Date(item.periodoMandato.fin) >= new Date() && new Date(item.ceseFecha) >= new Date();
    })

  const data = Array.from(new Set(diputados.map(d => d.bloque)))
    .map(bloque => ({
      bloque,
      cantidad: diputados.filter(d => d.bloque === bloque).length
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return Plot.plot({
    marginLeft: 140,
    marks: [
      Plot.barX(data, { x: "cantidad", y: "bloque", sort: { y: "-x" } }),
      Plot.text(data, {
        x: "cantidad",
        y: "bloque",
        text: "cantidad",
        dx: 5,
        tip: {},
      }),
    ]
  });
})()
```

### Diputados en funciones por provincia

```js eval code=false
(async () => {
  const diputados = (await getData())
    .filter(item => {
      return new Date(item.periodoMandato.fin) >= new Date() && new Date(item.ceseFecha) >= new Date();
    })

  const data = Array.from(new Set(diputados.map(d => d.provincia)))
    .map(provincia => ({
      provincia,
      cantidad: diputados.filter(d => d.provincia === provincia).length
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return Plot.plot({
    marginLeft: 140,
    marks: [
      Plot.barX(data, {
        x: "cantidad",
        y: "provincia",
        sort: { y: "-x" },
        tip: {
          title: d => d.provincia,
          body: d => d.cantidad
        }
      }),
    ]
  });
})()
```

## Diputados en funciones por provincia y bloque

```js eval code=false
(async () => {
  const colors = await getColors();

  const colorsMap = {
    1: {
      bg: dark ? colors.red[800] : colors.red[100],
      fg: dark ? colors.red[100] : colors.red[900],
    },
    2: {
      bg: dark ? colors.pink[800] : colors.pink[100],
      fg: dark ? colors.pink[100] : colors.pink[900],
    },
    3: {
      bg: dark ? colors.orange[800] : colors.orange[100],
      fg: dark ? colors.orange[100] : colors.orange[900],
    },
    4: {
      bg: dark ? colors.teal[800] : colors.teal[100],
      fg: dark ? colors.teal[100] : colors.teal[900],
    },
    5: {
      bg: dark ? colors.blue[800] : colors.blue[100],
      fg: dark ? colors.blue[100] : colors.blue[900],
    },
  }

  const data = await getData();

  const diputadosBloques = Array.from(new Set(data.map(d => d.bloque)))
    .map(bloque => ({
      bloque,
      valores: Array.from(new Set(data.filter(d => d.bloque === bloque).map(d => d.provincia)))
        .map(provincia => ({
          provincia,
          cantidad: data.filter(d => d.provincia === provincia && d.bloque === bloque).length
        }))
    }))

  const diputados = (data)
    .filter(item => {
      return new Date(item.periodoMandato.fin) >= new Date() && new Date(item.ceseFecha) >= new Date();
    })
    .sort((a, b) => {
      const aCount = diputadosBloques.find(p => p.bloque === a.bloque).valores.find(p => p.provincia === a.provincia).cantidad;
      const bCount = diputadosBloques.find(p => p.bloque === b.bloque).valores.find(p => p.provincia === b.provincia).cantidad;

      return bCount - aCount;
    });

  return Plot.plot({
    dark,
    width,
    marginTop: 150,
    marginLeft: 150,
    marginRight: 50,
    x: {
      axis: "top",
      tickRotate: -30,
    },
    marks: [
      Plot.cell(
        diputados,
        {
          x: "bloque",
          y: "provincia",
          fill: (d) => {
            const count = diputadosBloques.find(p => p.bloque === d.bloque).valores.find(p => p.provincia === d.provincia).cantidad;

            if (colorsMap[count]) {
              return colorsMap[count].bg;
            }

            return dark ? colors.indigo[800] : colors.indigo[100];
          },
        }
      ),
      Plot.text(diputados, {
        x: "bloque",
        y: "provincia",
        text: d => diputadosBloques.find(p => p.bloque === d.bloque).valores.find(p => p.provincia === d.provincia).cantidad,
        fill: (d) => {
          const count = diputadosBloques.find(p => p.bloque === d.bloque).valores.find(p => p.provincia === d.provincia).cantidad;

          if (colorsMap[count]) {
            return colorsMap[count].fg;
          }

          return dark ? colors.indigo[100] : colors.indigo[900];
        },
        dx: 0,
        dy: 0,
        tip: {
          fill: dark ? colors.gray[900] : colors.gray[100],
          stroke: dark ? colors.gray[700] : colors.gray[300],
        },
        fontSize: 12,
        fontWeigth: 800,
      }),
    ]
  });
})()
```
