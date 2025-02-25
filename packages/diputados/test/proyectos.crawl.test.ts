// import { describe, expect, it } from "vitest";
// import { crawlProyectos } from '../src/diputados/proyectos/crawlProyectos'
//
// describe('proyectos', () => {
//   it('crawl', async () => {
//     const result = await crawlProyectos({
//       year: 2024,
//     })
//
//     console.log(result)
//
//     expect(result).toBeDefined()
//     expect(Array.isArray(result)).toBe(true)
//     expect(result.length).toBeGreaterThan(0)
//
//     /**
//      *
//      * export interface Diputado {
//      *   id: string
//      *   nombre: string
//      *   apellido: string
//      *   genero: string
//      *   provincia: string
//      *   periodoMandato: {
//      *     inicio: string | null
//      *     fin: string | null
//      *   }
//      *   juramentoFecha: string
//      *   ceseFecha: string
//      *   bloque: string
//      *   periodoBloque: {
//      *     inicio: string | null
//      *     fin: string | null
//      *   }
//      * }
//      */
//
//     for (const diputado of result) {
//       expect(diputado).toMatchObject({
//         id: expect.any(String),
//         nombre: expect.any(String),
//         apellido: expect.any(String),
//         genero: expect.toBeOneOf(['F', 'M']),
//         provincia: expect.any(String),
//         periodoMandato: {
//           inicio: expect.any(String),
//           fin: expect.any(String),
//         },
//         juramentoFecha: expect.any(String),
//         ceseFecha: expect.any(String),
//         bloque: expect.any(String),
//         periodoBloque: {
//           inicio: expect.any(String),
//           fin: expect.toBeOneOf([null, expect.any(String)]),
//         },
//       })
//     }
//   }, {
//     timeout: 300000,
//   })
// })
