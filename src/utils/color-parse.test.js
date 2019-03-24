const parseColors = require('./color-parse')

test('empty-arg', () => {
  expect(parseColors()).toEqual([])
})

test('no-color', () => {
  expect(parseColors('Hello! There are no colors here.')).toEqual([])
})

test('single-color', () => {
  expect(parseColors('green')).toEqual([{ color: 'green', hex: '#008000' }])
})

test('random-casing', () => {
  expect(parseColors('tUrQuOIse')).toEqual([{ color: 'turquoise', hex: '#40E0D0' }])
})

test('multiple-colors', () => {
  const message = "This message has maroon and gold colors. Also cobalt!"
  expect(parseColors(message)).toEqual([
    { color: 'maroon', hex: '#800000' },
    { color: 'gold', hex: '#FFD700' },
    { color: 'cobalt', hex: '#3D59AB' }
  ])
})