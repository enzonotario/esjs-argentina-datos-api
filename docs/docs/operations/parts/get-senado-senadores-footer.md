## Ejemplos de uso

### Senadores en funciones por partido

```js eval code=false
(async () => {
  const data = (await fetch("https://api.argentinadatos.com/v1/senado/senadores").then(r => r.json()))
    .filter(senador => {
        return new Date(senador.periodoLegal.fin) >= new Date();
    })

  const partidos = Array.from(new Set(data.map(d => d.partido)))
    .map(partido => ({
      partido,
      count: data.filter(d => d.partido === partido).length
    }))
    .sort((a, b) => b.count - a.count);

  return Plot.plot({
    marginLeft: 140,
    marks: [
      Plot.barX(partidos, {x: "count", y: "partido", sort: {y: "-x"}}),
      Plot.text(partidos, {x: "count", y: "partido", text: "count", dx: 5})
    ]
  });
})()
```
