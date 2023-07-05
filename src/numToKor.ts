interface KoreanNumberUnit {
  text: string
  value: number
}

interface KoreanNumberValue {
  text: string
  value: number
}

export type TranslateType = 'DEFAULT' | 'EXCEPT_ONE' | 'INCLUDE_ONE' | 'EACH'

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

/**
 * 주어진 숫자를 한글 문자열로 변환
 * @param number 한글로 변환할 숫자
 * @param translateType 변환 유형 구분
 *                      DEFAULT : 관례에 따름(천만 단위까지는 '일'을 생략, 억 단위부터는 '일'을 생략 않음)
 *                      INCLUDE_ONE : 모든 경우에 '일'을 읽기 생략하지 않음
 *                      EXCEPT_ONE : 모든 경우에 '일'을 읽기 생략함
 *                      EACH : 단위로 읽지 않고 개별 숫자를 읽기 (전화번호, 우편번호 ...)
 * @returns 변환된 문자열
 */
export function numToKor(number: number, translateType: TranslateType = 'DEFAULT'): string {
  let numberHolder = Math.abs(number)
  const valueByUnit = units
    .sort((a, b) => b.value - a.value)
    .map((unit) => {
      if (numberHolder < unit.value) {
        return {
          unit: { ...unit },
          realValue: 0,
        }
      }

      const realValue = Math.floor(numberHolder / unit.value)
      numberHolder = numberHolder % unit.value
      return {
        unit: { ...unit },
        realValue,
      }
    })

  const result =
    valueByUnit.reduce<string>((korText, valueAndUnit) => {
      if (valueAndUnit.realValue === 0) {
        return korText
      }

      return korText + getKorUnder10000(valueAndUnit.realValue) + valueAndUnit.unit.text
    }, '') + (numberHolder !== 0 ? getKorUnder10000(numberHolder) : '')

  if (translateType === 'INCLUDE_ONE') {
    /** 모든 '일' 표기를 포함하는 옵션인 경우 그대로 리턴 */
    return result
  }

  if (translateType === 'EXCEPT_ONE') {
    /** '일' 표기를 제외하는 옵션인 경우 ^일억, ^일만, 일천, 일백, 일십 에서 '일'을 제거 */
    return result.replace(/일([천백십])/g, '$1').replace(/^일([해경조억만])/, '$1')
  }

  if (translateType === 'EACH') {
    /** 단순 읽기 */
    return Array.from(Math.abs(number).toString())
      .map((numberChar) => numbers.find((num) => num.value === Number.parseInt(numberChar))!.text)
      .join('')
  }

  /**
   * 관용적인 읽기방식에 따라 ^일만, 일천, 일백, 일십 에서 '일'을 제거
   * 일억 부터는 단위가 '일'이어도 읽기를 생략하지 않는 관례가 있다
   */
  return result.replace(/일([천백십])/g, '$1').replace(/^일만/, '만')
}

function getKorUnder10000(number: number): string {
  let numberHolder = Math.abs(number)
  if (numberHolder >= 10000) {
    throw new RangeError(`주어진 숫자가 9999보다 큽니다`)
  }

  const unitsUnder10000 = units.filter((unit) => unit.value <= 10000).sort((a, b) => b.value - a.value)
  const unitValueAndRealValueContext = unitsUnder10000.reduce(
    (context, unit) => {
      const realValue = Math.floor(context.remain / unit.value)
      if (realValue === 0) {
        return context
      }

      context.remain = context.remain % unit.value
      context.values = context.values.concat([
        {
          unit: { ...unit },
          realValue,
        },
      ])

      return context
    },
    {
      values: [] as { unit: KoreanNumberUnit; realValue: number }[],
      remain: numberHolder,
    }
  )

  return (
    unitValueAndRealValueContext.values.reduce((textHolder, unitValueAndRealValue) => {
      const koreanNumber = numbers.find((num) => num.value === unitValueAndRealValue.realValue)
      if (!koreanNumber) {
        return textHolder
      }

      return `${textHolder}${koreanNumber.text}${unitValueAndRealValue.unit.text}`
    }, '') +
    (unitValueAndRealValueContext.remain !== 0
      ? numbers.find((num) => num.value === unitValueAndRealValueContext.remain)?.text ?? ''
      : '')
  )
}
