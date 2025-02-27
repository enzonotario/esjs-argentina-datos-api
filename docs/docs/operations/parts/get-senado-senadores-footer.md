## Ejemplos de uso

```js eval code=false inspector=false
async function getColors() {
  return fetch('https://api.argentinadatos.com/static/colors.json').then(res => res.json());
}
```

```js eval code=false inspector=false
async function getData() {
  const data = await fetch('https://api.argentinadatos.com/v1/senado/senadores').then((res) => res.json())

  return data
}

```

### Senadores en funciones por partido

```js eval code=false
(async () => {
  const senadores = (await getData())
    .filter(senador => {
      return new Date(senador.periodoLegal.fin) >= new Date();
    })

  const data = Array.from(new Set(senadores.map(d => d.partido)))
    .map(partido => ({
      partido,
      cantidad: senadores.filter(d => d.partido === partido).length
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return Plot.plot({
    marginLeft: 140,
    marks: [
      Plot.barX(data, { x: "cantidad", y: "partido", sort: { y: "-x" } }),
      Plot.text(data, {
        x: "cantidad",
        y: "partido",
        text: "cantidad",
        dx: 5,
        tip: {},
      }),
    ]
  });
})()
```

### Senadores en funciones por provincia

```js eval code=false
(async () => {
  const senadores = (await getData())
    .filter(senador => {
      return new Date(senador.periodoLegal.fin) >= new Date();
    })

  const data = Array.from(new Set(senadores.map(d => d.provincia)))
    .map(provincia => ({
      provincia,
      cantidad: senadores.filter(d => d.provincia === provincia).length
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

## Senadores en funciones por provincia y partido

```js eval code=false
(async () => {
  const colors = await getColors();

  const colorsMap = {
    1: {
      bg: dark ? colors.red[500] : colors.red[100],
      fg: dark ? colors.red[100] : colors.red[900],
    },
    2: {
      bg: dark ? colors.pink[500] : colors.pink[100],
      fg: dark ? colors.pink[100] : colors.pink[900],
    },
    3: {
      bg: dark ? colors.orange[500] : colors.orange[100],
      fg: dark ? colors.orange[100] : colors.orange[900],
    },
    4: {
      bg: dark ? colors.teal[500] : colors.teal[100],
      fg: dark ? colors.teal[100] : colors.teal[900],
    },
    5: {
      bg: dark ? colors.blue[500] : colors.blue[100],
      fg: dark ? colors.blue[100] : colors.blue[900],
    },
  }

  const data = await getData();

  const senadoresPartidos = Array.from(new Set(data.map(d => d.partido)))
    .map(partido => ({
      partido,
      valores: Array.from(new Set(data.filter(d => d.partido === partido).map(d => d.provincia)))
        .map(provincia => ({
          provincia,
          cantidad: data.filter(d => d.provincia === provincia && d.partido === partido).length
        }))
    }))

  const senadores = (data)
    .filter(senador => {
      return new Date(senador.periodoLegal.fin) >= new Date();
    })
    .sort((a, b) => {
      const aCount = senadoresPartidos.find(p => p.partido === a.partido).valores.find(p => p.provincia === a.provincia).cantidad;
      const bCount = senadoresPartidos.find(p => p.partido === b.partido).valores.find(p => p.provincia === b.provincia).cantidad;

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
        senadores,
        {
          x: "partido",
          y: "provincia",
          fill: (d) => {
            const count = senadoresPartidos.find(p => p.partido === d.partido).valores.find(p => p.provincia === d.provincia).cantidad;

            if (colorsMap[count]) {
              return colorsMap[count].bg;
            }

            return dark ? colors.indigo[500] : colors.indigo[100];
          },
        }
      ),
      Plot.text(senadores, {
        x: "partido",
        y: "provincia",
        text: d => senadoresPartidos.find(p => p.partido === d.partido).valores.find(p => p.provincia === d.provincia).cantidad,
        fill: (d) => {
          const count = senadoresPartidos.find(p => p.partido === d.partido).valores.find(p => p.provincia === d.provincia).cantidad;

          if (colorsMap[count]) {
            return colorsMap[count].fg;
          }

          return dark ? colors.indigo[900] : colors.indigo[100];
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
