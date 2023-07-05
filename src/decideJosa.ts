export interface DecideJosaFilterOptions {
  /**
   * 엄격한 검사 적용 여부
   * true인 경우 [(이/가), 을(를)]처럼 비교적 명확한 대상만 걸러냄
   * false인 경우 [이/가, 을/를]처럼 비교적 명확하지 않은 대상도 걸러냄
   * @default true
   */
  strict?: boolean

  /**
   * 제외 대상
   */
  except?: (string | RegExp)[]
}

interface ImpurityOfJosaPattern {
  /** 엄격검사 적용 여부 */
  isStrict: boolean

  /** 찾을 문자열 */
  searchText: string
}

interface ImpurityOfJosa {
  /** 구분명 */
  id: string

  /** 적용할 패턴 목록 */
  patterns: ImpurityOfJosaPattern[]

  /** 종성이 있을 때 적용할 문자열 */
  replaceTextWhenHas종성: string

  /** 종성이 없을 때 적용할 문자열 */
  replaceTextWhenHasNot종성: string
}

const impuritiesOfJosa: ImpurityOfJosa[] = [
  {
    id: '이(가)',
    patterns: [
      {
        isStrict: true,
        searchText: '이(가)',
      },
      {
        isStrict: true,
        searchText: '가(이)',
      },
      {
        isStrict: true,
        searchText: '(이/가)',
      },
      {
        isStrict: true,
        searchText: '(가/이)',
      },
      {
        isStrict: false,
        searchText: '이/가',
      },
      {
        isStrict: false,
        searchText: '가/이',
      },
    ],
    replaceTextWhenHas종성: '이',
    replaceTextWhenHasNot종성: '가',
  },
  {
    id: '을(를)',
    patterns: [
      {
        isStrict: true,
        searchText: '을(를)',
      },
      {
        isStrict: true,
        searchText: '를(을)',
      },
      {
        isStrict: true,
        searchText: '(을/를)',
      },
      {
        isStrict: true,
        searchText: '(를/을)',
      },
      {
        isStrict: false,
        searchText: '을/를',
      },
      {
        isStrict: false,
        searchText: '를/을',
      },
    ],
    replaceTextWhenHas종성: '을',
    replaceTextWhenHasNot종성: '를',
  },
  {
    id: '은(는)',
    patterns: [
      {
        isStrict: true,
        searchText: '은(는)',
      },
      {
        isStrict: true,
        searchText: '는(은)',
      },
      {
        isStrict: true,
        searchText: '(은/는)',
      },
      {
        isStrict: true,
        searchText: '(는/은)',
      },
      {
        isStrict: false,
        searchText: '은/는',
      },
      {
        isStrict: false,
        searchText: '는/은',
      },
    ],
    replaceTextWhenHas종성: '은',
    replaceTextWhenHasNot종성: '는',
  },
  {
    id: '와(과)',
    patterns: [
      {
        isStrict: true,
        searchText: '와(과)',
      },
      {
        isStrict: true,
        searchText: '과(와)',
      },
      {
        isStrict: true,
        searchText: '(와/과)',
      },
      {
        isStrict: true,
        searchText: '(과/와)',
      },
      {
        isStrict: false,
        searchText: '와/과',
      },
      {
        isStrict: false,
        searchText: '과/와',
      },
    ],
    replaceTextWhenHas종성: '과',
    replaceTextWhenHasNot종성: '와',
  },
  {
    id: '로(으로)',
    patterns: [
      {
        isStrict: true,
        searchText: '로(으로)',
      },
      {
        isStrict: true,
        searchText: '으로(로)',
      },
      {
        isStrict: true,
        searchText: '(으로/로)',
      },
      {
        isStrict: true,
        searchText: '(로/으로)',
      },
      {
        isStrict: false,
        searchText: '으로/로',
      },
      {
        isStrict: false,
        searchText: '로/으로',
      },
    ],
    replaceTextWhenHas종성: '으로',
    replaceTextWhenHasNot종성: '로',
  },
  {
    id: '이에(예)',
    patterns: [
      {
        isStrict: true,
        searchText: '이에(예)',
      },
      {
        isStrict: true,
        searchText: '예(이에)',
      },
      {
        isStrict: true,
        searchText: '(이에/예)',
      },
      {
        isStrict: true,
        searchText: '(예/이에)',
      },
      {
        isStrict: false,
        searchText: '이에/예',
      },
      {
        isStrict: false,
        searchText: '예/이에',
      },
    ],
    replaceTextWhenHas종성: '이에',
    replaceTextWhenHasNot종성: '예',
  },
]

/**
 * 주어진 문장에서 결정되지 않은 조사를 걸러내 돌려준다.
 * @param textContainingImpurities 불순물(결정되지 않은 조사)을 포함한 문자열
 * @param filterOptions 세부 옵션
 * @returns 결정되지 않은 조사를 결정, 걸러낸 결과
 */
export function decideJosa(textContainingImpurities: string, filterOptions?: DecideJosaFilterOptions): string {
  /** 옵션값 타입처리 */
  const options: DecideJosaFilterOptions = Object.assign(
    {
      strict: true,
      except: [],
    },
    filterOptions ?? {}
  )

  /** 치환 텍스트 홀딩 변수 할당 */
  let replaceHolder = textContainingImpurities

  /** textContainingImpurities에 존재하지 않는 치환용 구분자 생성 시도 */
  const delimiterCharList = ['#', '^', '$', '*']
  let delimiter = ''
  let hasClearDelimiter = false
  for (let index = 0; index < 100; index++) {
    delimiter += delimiterCharList[Math.floor(Math.random() * delimiterCharList.length)]
    if (textContainingImpurities.indexOf(delimiter) < 0) {
      hasClearDelimiter = true
      break
    }
  }

  if (!hasClearDelimiter) {
    console.warn(`고유한 구분자 구성에 실패했습니다. 의도치 않은 치환이 발생할 수 있습니다.`)
  }

  /** except 탈출처리 */
  const escapeMap: { [key: string]: string } = {}
  replaceHolder = (options.except ?? []).reduce<string>((escaped, except, index) => {
    const escapeKey = `${delimiter}EXCEPT_${index}${delimiter}`
    if (typeof except === 'string') {
      escaped = escaped.replaceAll(except, escapeKey)
      escapeMap[escapeKey] = except
    } else {
      const globalizeRegExp = new RegExp(except, 'g')
      const matches = escaped.matchAll(globalizeRegExp)
      Array.from(matches).map((match, matchIndex) => {
        const escapeChildKey = `${escapeKey}(${matchIndex})${delimiter}`
        escaped = escaped.replace(match[0], escapeChildKey)
        escapeMap[escapeChildKey] = match[0]
      })
    }

    return escaped
  }, replaceHolder)

  /**
   * 구분자를 사용해 대상 문자열 치환, impurity identity 취합 처리
   * ex) 봄날(은/는) 간다, 봄날은/는 간다, 봄날는(은) 간다 -> 봄날#^*은(는)#^* 간다
   */
  impuritiesOfJosa.forEach((impurity) => {
    impurity.patterns.forEach((pattern) => {
      if (pattern.isStrict !== true && options.strict !== true) {
        return
      }

      if (replaceHolder.indexOf(pattern.searchText) > -1) {
        replaceHolder = replaceHolder.replaceAll(pattern.searchText, `${delimiter}${impurity.id}${delimiter}`)
      }
    })
  })

  /** 치환된 impurity string으로 종성에 따른 조사 치환 */
  impuritiesOfJosa.forEach((impurity) => {
    const splitKey = `${delimiter}${impurity.id}${delimiter}`
    while (replaceHolder.indexOf(splitKey) > -1) {
      const [begin, ...rest] = replaceHolder.split(splitKey)

      /** 한글, 알파벳, 숫자 제외한 문자를 제거해주기(=읽기에 반영되지 않는다고 보기) */
      const cleanBegin = begin.replace(/\(.*\)/g, '').replace(/[^가-힣a-z\d]/gi, '')

      const has종성 =
        /** 한글로 끝나는 case => 곰이(가) 귀여워 => '곰'에 대한 종성 체크 */
        (/[가-힣]$/.test(cleanBegin) && (cleanBegin.substr(-1).charCodeAt(0) - 0xac00) % 28 > 0) ||
        /** 숫자로 시작해서 숫자로 끝나는 case => 432103을(를) 10으로 나누세요 => 직전 숫자(3)에 대한 종성 체크 : [영, 일, 삼, 육, 칠, 팔]에 대해 종성이 있음으로 보기 */
        /** 숫자만으로 이어진다면 하나둘셋이 아니라 영일이삼으로 읽는다고 가정 */
        /^\d*[013678]$/.test(cleanBegin) ||
        /** 한글에 이어지는 숫자로 끝나는 case => 문제 14(이/가) 어떤 내용이었더라? => 숫자로 시작해서 숫자로 끝나는 case와 동일하게 판단 */
        /[가-힣]\d*[013678]$/.test(cleanBegin) ||
        /** 알파벳에 이어지는 숫자로 끝나는 case => 고객님 객실은 ROOM 17입니다 => 직전 숫자(7)에 대한 종성 체크 : [원, 세븐, 에잇, 나인]에 대해 종성이 있음으로 보기 */
        /** @NOTE 단위 바뀌는 숫자에 대한 경우도 처리 고려 (ex: 13(써틴), 14(포틴), 1000000(밀리언) 등) */
        /[a-z]\d*[1789]$/i.test(cleanBegin) ||
        /** 알파벳으로 끝나는, 그리고 익히 알려진 묵음에 대한 case */
        /([clmnp]|[blnt](e)|[co](k)|[aeiou](t)|mb|ng|lert)$/i.test(cleanBegin)

      replaceHolder = `${begin}${
        has종성 ? impurity.replaceTextWhenHas종성 : impurity.replaceTextWhenHasNot종성
      }${rest.join(splitKey)}`
    }
  })

  /** except 복구 */
  for (const key in escapeMap) {
    if (Object.prototype.hasOwnProperty.call(escapeMap, key)) {
      const value = escapeMap[key]
      replaceHolder = replaceHolder.replace(key, value)
    }
  }

  return replaceHolder
}
