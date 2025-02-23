## Ejemplos de uso

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
  const senadores = (await getData())
    .filter(senador => {
      return new Date(senador.periodoLegal.fin) >= new Date();
    })

  const data = Array.from(new Set(senadores.map(d => d.partido)))
    .map(partido => ({
      partido,
      valores: Array.from(new Set(senadores.filter(d => d.partido === partido).map(d => d.provincia)))
        .map(provincia => ({
          provincia,
          cantidad: senadores.filter(d => d.provincia === provincia && d.partido === partido).length
        }))
    }))
  
  return Plot.plot({
    marginTop: 200,
    marginLeft: 200,
    x: {
      axis: "top",
      tickRotate: -30,
    },
    color: {scheme: "Pastel1"},
    marks: [
      Plot.cell(
        senadores,
        {
          x: "partido",
          y: "provincia",
          fill: "partido",
        }
      ),
      Plot.text(senadores, {
        x: "partido",
        y: "provincia",
        text: d => data.find(p => p.partido === d.partido).valores.find(p => p.provincia === d.provincia).cantidad,
        dx: 0,
        dy: 0,
        tip: {},
        fontSize: 12,
        fontWeigth: 800,
      }),
    ]
  });
})()
```
