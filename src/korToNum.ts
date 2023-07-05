interface KoreanNumberUnit {
  text: string
  value: number
}

interface KoreanNumberValue {
  text: string
  value: number
}

const units: KoreanNumberUnit[] = [
  { text: '십', value: 10 },
  { text: '백', value: 100 },
  { text: '천', value: 1_000 },
  { text: '만', value: 10_000 },
  { text: '억', value: 100_000_000 },
  { text: '조', value: 1_000_000_000_000 },
  { text: '경', value: 10_000_000_000_000_000 },
  { text: '해', value: 100_000_000_000_000_000_000 },
]

const numbers: KoreanNumberValue[] = [
  { text: '공', value: 0 },
  { text: '일', value: 1 },
  { text: '이', value: 2 },
  { text: '삼', value: 3 },
  { text: '사', value: 4 },
  { text: '오', value: 5 },
  { text: '육', value: 6 },
  { text: '칠', value: 7 },
  { text: '팔', value: 8 },
  { text: '구', value: 9 },
]

const possibleCharList = [...numbers.map((number) => number.text), ...units.map((unit) => unit.text)]

/**
 * 주어진 한글 문자열을 숫자로 변환
 * @param korText 숫자로 추정하는 한글 문자열
 * @returns 변환된 숫자값
 * @throws 숫자로 변환할 수 없는 값일 때
 */
export function korToNum(korText: string): number {
  const impossibleError = RangeError(`주어진 값을 숫자로 변환할 수 없습니다 : ${korText}`)
  const impossibleRegExp = new RegExp(`[^${possibleCharList.join('')}]`)
  if (korText.match(impossibleRegExp)) {
    throw impossibleError
  }

  /** 단위값이 하나도 없다면 withoutUnit 변환 */
  if (!korText.match(new RegExp(`[${units.map((unit) => unit.text).join('')}]`))) {
    return korToNumWithoutUnit(korText)
  }

  const unitsOver10000 = units.filter((unit) => unit.value >= 10000).sort((a, b) => b.value - a.value)
  let textHolder = korText
  const under10000ValueByUnit = unitsOver10000.reduce<{ unit: KoreanNumberUnit; realValue: number }[]>(
    (context, unit) => {
      if (textHolder.indexOf(unit.text) < 0) {
        /** 단위에 속하는 숫자가 없으면 return */
        return context
      }

      const [beforeUnit, ...rest] = textHolder.split(unit.text)
      const beforeUnitWithDefault = beforeUnit === '' ? '일' : beforeUnit

      if (rest.length > 1) {
        /**
         * 높은 단위부터 순차진행했을 때 rest가 2개 이상 나왔다는 얘기는 유효하지 않은 문자열이라는 의미
         * ex) 오천만삼천만이천만십이
         */
        throw impossibleError
      }

      context = context.concat([{ unit: { ...unit }, realValue: getNumberUnder10000(beforeUnitWithDefault) }])
      textHolder = rest.join('')

      return context
    },
    []
  )

  return (
    under10000ValueByUnit.reduce((sum, valueByUnit) => sum + valueByUnit.realValue * valueByUnit.unit.value, 0) +
    getNumberUnder10000(textHolder)
  )
}

/**
 * 단위 없는 숫자 문자열 변환
 * @param korText 숫자로 읽어낼 문자열
 * @returns 읽어낸 숫자값
 */
function korToNumWithoutUnit(korText: string): number {
  const impossibleError = RangeError(`주어진 값을 숫자로 변환할 수 없습니다 : ${korText}`)
  const impossibleRegExp = new RegExp(`[^${numbers.map((number) => number.text).join('')}]`)
  if (korText.match(impossibleRegExp)) {
    throw impossibleError
  }

  return Array.from(korText).reduce((sum, char, index) => {
    const value = getNumberExactUnitOrNumber(char)
    if (value === null) {
      /** 오류 but return */
      return sum
    }

    return sum + 10 ** (korText.length - index - 1) * value
  }, 0)
}

/**
 * 단일 숫자, 또는 단일 단위에 해당하는 값 반환
 * @example
 * ```typescript
 * getNumberExactUnitOrNumber('천') // 1000
 * getNumberExactUnitOrNumber('삼') // 3
 * getNumberExactUnitOrNumber('뭐') // null
 * ```
 * @param text 변환 시도할 문자값
 * @returns 변환 가능한 값이 있다면 값, 그렇지 않으면 null
 */
function getNumberExactUnitOrNumber(text: string): number | null {
  const singleNumber = numbers.find((number) => number.text === text)
  if (singleNumber) {
    return singleNumber.value
  }

  const singleNumberUnit = units.find((unit) => unit.text === text)
  if (singleNumberUnit) {
    return singleNumberUnit.value
  }

  return null
}

/**
 * 10000 이하의 숫자를 변환 시도
 * @param korText 변환 시도할 문자열
 * @returns 변환된 숫자값
 */
function getNumberUnder10000(korText: string): number {
  const impossibleError = RangeError(`주어진 값을 숫자로 변환할 수 없습니다 : ${korText}`)
  const impossibleRegExp = new RegExp(`[^${possibleCharList.join('')}]`)
  if (korText.match(impossibleRegExp)) {
    throw impossibleError
  }

  const exactValue = getNumberExactUnitOrNumber(korText)
  if (exactValue !== null) {
    return exactValue
  }

  const unitsUnder10000 = units.filter((unit) => unit.value <= 10000).sort((a, b) => b.value - a.value)
  let textHolder = korText
  const under10000ValueByUnit = unitsUnder10000.reduce<{ unit: KoreanNumberUnit; realValue: number }[]>(
    (context, unit) => {
      if (textHolder.indexOf(unit.text) < 0) {
        /** 단위에 속하는 숫자가 없으면 return */
        return context
      }

      const [beforeUnit, ...rest] = textHolder.split(unit.text)
      const beforeUnitWithDefault = beforeUnit === '' ? '일' : beforeUnit

      if (rest.length > 1) {
        /**
         * 높은 단위부터 순차진행했을 때 rest가 2개 이상 나왔다는 얘기는 유효하지 않은 문자열이라는 의미
         * ex) 오천만삼천만이천만십이
         */
        throw impossibleError
      }

      context = context.concat([{ unit: { ...unit }, realValue: getNumberUnder10000(beforeUnitWithDefault) }])
      textHolder = rest.join('')

      return context
    },
    []
  )

  return (
    under10000ValueByUnit.reduce((sum, valueByUnit) => sum + valueByUnit.realValue * valueByUnit.unit.value, 0) +
    (getNumberExactUnitOrNumber(textHolder) ?? 0)
  )
}
