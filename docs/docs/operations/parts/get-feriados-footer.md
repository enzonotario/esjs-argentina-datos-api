## Ejemplos de uso

<div class="flex flex-col gap-8">

<ChartProximoFeriado />

<ChartFeriados />

</div>

### Calendario por mes

```js eval code=false inspector=false
async function getData() {
    const data = await fetch('https://api.argentinadatos.com/v1/feriados').then((res) => res.json())

    const colorsMap = {
        inamovible: '#f97316',
        trasladable: '#3b82f6',
        puente: '#22c55e',
    }
  
    const allDays = []
  
    const startDate = new Date(data[0].fecha)
    const endDate = new Date(startDate.getUTCFullYear(), 11, 31)
  
    for (let i = startDate.getUTCDay(); i > 0; i--) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() - i)
      
        allDays.push({
            fecha: date.toISOString().slice(0, 10),
            nombre: "",
            tipo: '',
            diaSemana: date.getUTCDay(),
            mes: startDate.getUTCMonth(),
            año: startDate.getUTCFullYear(),
            color: '#fff',
            colorTexto: '#000',
            semanaAño: 1,
            semanaMes: 1,
        })
    }
  
    while (startDate <= endDate) {
      const diaFeriado = data.find((d) => d.fecha === startDate.toISOString().slice(0, 10))
    
      const finSemana = startDate.getUTCDay() === 0 || startDate.getUTCDay() === 6
      
      const semana = Math.ceil((startDate - new Date(startDate.getUTCFullYear(), 0, 1)) / 86400000 / 7)
      
      const semanaMes = (date) => {
        const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth(), 1)
        return Math.ceil((date.getUTCDate() + firstDay.getUTCDay()) / 7)
      }
      
      const x = Math.ceil((allDays.length + 1) / 7)
      
      if (diaFeriado) {
          allDays.push({
            fecha: startDate.toISOString().slice(0, 10),
            nombre: data.find((d) => d.fecha === startDate.toISOString().slice(0, 10)).nombre,
            tipo: data.find((d) => d.fecha === startDate.toISOString().slice(0, 10)).tipo,
            diaSemana: startDate.getUTCDay(),
            semana: semana,
            mes: startDate.getUTCMonth(),
            año: startDate.getUTCFullYear(),
            color: colorsMap[diaFeriado.tipo],
            colorTexto: '#fff',
            semanaAño: x,
            semanaMes: semanaMes(startDate),
          })
        } else {
          allDays.push({
            fecha: startDate.toISOString().slice(0, 10),
            nombre: "",
            tipo: '',
            diaSemana: startDate.getUTCDay(),
            semana: semana,
            mes: startDate.getUTCMonth(),
            año: startDate.getUTCFullYear(),
            color: finSemana ? '#6b7280' : '#e5e7eb',
            colorTexto: finSemana ? '#fff' : '#000',
            semanaAño: x,
            semanaMes: semanaMes(startDate),
          })
        }
        
        startDate.setDate(startDate.getDate() + 1)
    }
    
    for (let i = 1; i < 7 - endDate.getUTCDay(); i++) {
        const date = new Date(endDate)
        date.setDate(endDate.getDate() + i)
      
        allDays.push({
            fecha: date.toISOString().slice(0, 10),
            nombre: "",
            tipo: '',
            diaSemana: date.getUTCDay(),
            mes: allDays[allDays.length - 1].mes,
            año: date.getUTCFullYear(),
            color: '#fff',
            colorTexto: '#000',
            semanaAño: allDays[allDays.length - 1].semanaAño,
            semanaMes: allDays[allDays.length - 1].semanaMes,
        })
    }
    
    return allDays.map((d, index) => {
        d.diaAnio = index
        d.mesNombre = new Date(d.año, d.mes, 1).toLocaleString('es-ES', { month: 'long' })
        return d
    })
}

```

```js eval code=false
(async () => {
  const data = await getData()
  
  return Plot.plot({
    width: 350,
    marginRight: 100,
    padding: 0,
    x: {
      axis: 'top',
    },
    y: {
      tickFormat: Plot.formatWeekday("es", "narrow"), 
      tickSize: 0,
    },
    facet: {
      data: data,
      y: d => d.mes,
    },
    fy: {
      tickFormat: d => new Date(0, d, 1).toLocaleString('es-ES', { month: 'long' }),
    },
    marks: [
      Plot.cell(data, {
        x: d => d.semanaMes,
        y: d => d.diaSemana,
        fill: d => d.color,
        tip: {
          format: {
            fecha: true,
            x:  d => `Semana ${d}`,
            y: d => new Date(0, 0, d).toLocaleString('es-ES', { weekday: 'long' }),
            fy: d => new Date(0, d, 1).toLocaleString('es-ES', { month: 'long' }),
            stroke: false,
          }
        },
      }),
      Plot.text(data, {
        x: d => d.semanaMes,
        y: d => d.diaSemana,
        text: d => d.fecha.slice(8, 10),
        fill: d => d.colorTexto,
        align: 'center',
        baseline: 'middle',
        fontSize: 8,
      }),
    ]
  })
})()
```
