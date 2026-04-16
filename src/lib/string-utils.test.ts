import { formatToDate, toDateOnlyString } from './string-utils'

describe('string-utils date normalization', () => {
  it('preserves calendar dates for ISO date-only strings', () => {
    expect(formatToDate('2009-12-16')).toBe('12/16/2009')
    expect(toDateOnlyString('2009-12-16')).toBe('2009-12-16')
  })

  it('preserves calendar dates for ISO timestamps when seeding date inputs', () => {
    expect(formatToDate('2009-12-16T00:00:00Z')).toBe('12/16/2009')
    expect(toDateOnlyString('2009-12-16T00:00:00Z')).toBe('2009-12-16')
  })
})
