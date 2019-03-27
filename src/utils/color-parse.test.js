const parseColors = require('./color-parse')

test('empty-arg', () => {
  expect(parseColors()).toEqual([])
})

test('no-color', () => {
  expect(parseColors('Hello! There are no colors here')).toEqual([])
})

test('single-color', () => {
  expect(parseColors('green')).toEqual([{ color: 'green', hex: '#008000' }])
})

test('random-casing', () => {
  expect(parseColors('tUrQuOIse')).toEqual([
    { color: 'turquoise', hex: '#40E0D0' }
  ])
})

test('multiple-colors', () => {
  const message = 'This message has the colors maroon, gold, and cobalt'
  expect(parseColors(message)).toEqual([
    { color: 'maroon', hex: '#800000' },
    { color: 'gold', hex: '#FFD700' },
    { color: 'cobalt', hex: '#3D59AB' }
  ])
})

test('punctuations', () => {
  const message =
    'This message has red! green. ?blue with starting/ending punctuations'
  expect(parseColors(message)).toEqual([
    { color: 'red', hex: '#FF0000' },
    { color: 'green', hex: '#008000' },
    { color: 'blue', hex: '#0000FF' }
  ])
})

test('additional-cases', () => {
  const message = 'This should only register blue... r.e.d'
  expect(parseColors(message)).toEqual([{ color: 'blue', hex: '#0000FF' }])
})

test('same-colors', () => {
  const message = 'This message has blue color and then blue again!'
  expect(parseColors(message)).toEqual([{ color: 'blue', hex: '#0000FF' }])
})
