const parseColors = require('./color-parse')

// Problems?? -> https://github.com/facebook/jest/issues/5998

test('empty-arg', () => {
  expect(parseColors()).toEqual([])
})

test('no-color', () => {
  expect(parseColors('Hello! There are no colors here.')).toEqual([])
})

test('single-color', () => {
  expect(parseColors('green')).toEqual([{ color: 'green', hex: '#008000' }])
})
