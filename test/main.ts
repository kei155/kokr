import { expect } from 'chai'
import * as kokr from '../dist/index'
import { describe, it } from 'mocha'

interface ParagraphTestForDecideJosa {
  result: string
  holder: string
  targetCases: string[]
}

describe('구동 테스트', () => {
  it('개발확인용 테스트', () => {
    expect(kokr.decideJosa(`구관이(가) 명관이다`)).to.equal('구관이 명관이다')
  })
})

describe('종성이 있는 한글 치환 테스트', () => {
  const paragraphs: ParagraphTestForDecideJosa[] = [
    {
      result: '구관이 명관이다',
      holder: '구관:here: 명관이다',
      targetCases: ['(이/가)', '이(가)', '이/가', '(가/이)', '가(이)', '가/이'],
    },
    {
      result: '창문을 열어다오',
      holder: '창문:here: 열어다오',
      targetCases: ['(을/를)', '을(를)', '을/를', '(를/을)', '를(을)', '를/을'],
    },
    {
      result: '폭발은 예술이다',
      holder: '폭발:here: 예술이다',
      targetCases: ['(은/는)', '은(는)', '은/는', '(는/은)', '는(은)', '는/은'],
    },
    {
      result: '치킨과 맥주',
      holder: '치킨:here: 맥주',
      targetCases: ['(와/과)', '와(과)', '와/과', '(과/와)', '과(와)', '과/와'],
    },
    {
      result: '전력으로 가자',
      holder: '전력:here: 가자',
      targetCases: ['(로/으로)', '로(으로)', '로/으로', '(으로/로)', '으로(로)', '으로/로'],
    },
  ]

  Array.from(paragraphs).forEach((paragraph) => {
    paragraph.targetCases.forEach((targetCase) => {
      it(`${targetCase} 치환`, () => {
        expect(kokr.decideJosa(paragraph.holder.replace(':here:', `${targetCase}`))).to.equal(paragraph.result)
      })
    })
  })
})

describe('종성이 없는 한글 치환 테스트', () => {
  const paragraphs: ParagraphTestForDecideJosa[] = [
    {
      result: '고지가 저 앞이다',
      holder: '고지:here: 저 앞이다',
      targetCases: ['(이/가)', '이(가)', '이/가', '(가/이)', '가(이)', '가/이'],
    },
    {
      result: '고양이를 데려왔어요',
      holder: '고양이:here: 데려왔어요',
      targetCases: ['(을/를)', '을(를)', '을/를', '(를/을)', '를(을)', '를/을'],
    },
    {
      result: '우주는 숨쉰다',
      holder: '우주:here: 숨쉰다',
      targetCases: ['(은/는)', '은(는)', '은/는', '(는/은)', '는(은)', '는/은'],
    },
    {
      result: '아기와 나',
      holder: '아기:here: 나',
      targetCases: ['(와/과)', '와(과)', '와/과', '(과/와)', '과(와)', '과/와'],
    },
    {
      result: '파리로 떠나갔어요',
      holder: '파리:here: 떠나갔어요',
      targetCases: ['(로/으로)', '로(으로)', '로/으로', '(으로/로)', '으로(로)', '으로/로'],
    },
  ]

  Array.from(paragraphs).forEach((paragraph) => {
    paragraph.targetCases.forEach((targetCase) => {
      it(`${targetCase} 치환`, () => {
        expect(kokr.decideJosa(paragraph.holder.replace(':here:', `${targetCase}`))).to.equal(paragraph.result)
      })
    })
  })
})

describe('숫자에 맞는 조사 치환 테스트', () => {
  const onlyNumbersWith종성 = [0, 1, 3, 6, 7, 8]
  Array.from(new Array(10)).forEach((_, number) => {
    it(`숫자 ${number}에 이어지는 조사 (ex: ${number}은(는) 6보다 작다)`, () => {
      expect(kokr.decideJosa(`${number}은(는) 11보다 작다`)).to.equal(
        `${number}${onlyNumbersWith종성.includes(number) ? '은' : '는'} 11보다 작다`
      )
    })
  })

  const koreanAndNumbersWith종성 = [0, 1, 3, 6, 7, 8]
  Array.from(new Array(10)).forEach((_, number) => {
    it(`한글 + 숫자 ${number}에 이어지는 조사 (ex: 문항 ${number}을(를) 보세요)`, () => {
      expect(kokr.decideJosa(`문항 ${number}을(를) 보세요`)).to.equal(
        `문항 ${number}${koreanAndNumbersWith종성.includes(number) ? '을' : '를'} 보세요`
      )
    })
  })

  const englishAndNumbersWith종성 = [1, 7, 8, 9]
  Array.from(new Array(10)).forEach((_, number) => {
    it(`영어 + 숫자 ${number}에 이어지는 조사 (ex: room ${number}로(으로) 들어가세요)`, () => {
      expect(kokr.decideJosa(`room ${number}로(으로) 들어가세요`)).to.equal(
        `room ${number}${englishAndNumbersWith종성.includes(number) ? '으로' : '로'} 들어가세요`
      )
    })
  })
})

describe('특수문자와 조합된 케이스 치환 테스트', () => {
  it(`괄호 안에 포함된 숫자 또는 문자가 있는 경우 (ex: 나는 슈퍼스타(자칭)가 되었다)`, () => {
    expect(kokr.decideJosa(`나는 슈퍼스타(자칭)이(가) 되었다`)).to.equal(`나는 슈퍼스타(자칭)가 되었다`)
  })

  it(`조사 전에 특수문자가 존재하는 경우 (ex: 내가 너...을(를) 좋아해`, () => {
    expect(kokr.decideJosa(`내가 너...을(를) 좋아해`)).to.equal(`내가 너...를 좋아해`)
  })
})

describe('다중 치환 테스트', () => {
  it(`별 헤는 밤`, () => {
    expect(
      kokr.decideJosa(`계절이(가) 지나가는 하늘에는
    가을로 가득 차 있습니다.
    
    나은/는 아무 걱정도 없이
    가을 속의 별들(을/를) 다 헤일 듯합니다.
    
    가슴 속에 하나 둘 새겨지는 별을(를)
    이제 다 못 헤는 것는(은)
    쉬이 아침(이/가) 오는 까닭이요,
    내일 밤이(가) 남은 까닭이요,
    아직 나의 청춘가(이) 다하지 않은 까닭입니다.`)
    ).to.equal(`계절이 지나가는 하늘에는
    가을로 가득 차 있습니다.
    
    나는 아무 걱정도 없이
    가을 속의 별들을 다 헤일 듯합니다.
    
    가슴 속에 하나 둘 새겨지는 별을
    이제 다 못 헤는 것은
    쉬이 아침이 오는 까닭이요,
    내일 밤이 남은 까닭이요,
    아직 나의 청춘이 다하지 않은 까닭입니다.`)
  })

  it(`낙화`, () => {
    expect(
      kokr.decideJosa(`가야 할 때(이/가) 언제인가(을/를)
    분명히 알고 가은(는) 이의
    뒷모습은/는 얼마나 아름다운가
    봄 한철 격정(을/를) 인내한
    나의 사랑(은/는) 지고 있다
    분분한 낙화
    결별이/가 이룩하(는/은) 축복에 싸여
    지금은(는) 가야 할 때`)
    ).to.equal(`가야 할 때가 언제인가를
    분명히 알고 가는 이의
    뒷모습은 얼마나 아름다운가
    봄 한철 격정을 인내한
    나의 사랑은 지고 있다
    분분한 낙화
    결별이 이룩하는 축복에 싸여
    지금은 가야 할 때`)
  })
})

describe(`치환 제외 테스트`, () => {
  it(`특정 문구에 대한 조사 치환 제외`, () => {
    expect(
      kokr.decideJosa(
        `출연진 리스트
    - 멍멍이(가)
    - 야옹이(나)
    - 삐약이(다)`,
        {
          except: [`멍멍이(가)`],
        }
      )
    ).to.equal(`출연진 리스트
    - 멍멍이(가)
    - 야옹이(나)
    - 삐약이(다)`)
  })

  it(`특정 정규식에 대한 조사 치환 제외`, () => {
    expect(
      kokr.decideJosa(
        `가/나/다 팀원 명단
- 한송이(가)
- 이명석(나)
- 김오이(가)
- 손상선(나)
- 김정이(가)
- 정호성(나)
- 한이(가)`,
        {
          except: [/\-\s[가-힣]{1,3}\(가\)/],
        }
      )
    ).to.equal(
      `가/나/다 팀원 명단
- 한송이(가)
- 이명석(나)
- 김오이(가)
- 손상선(나)
- 김정이(가)
- 정호성(나)
- 한이(가)`
    )
  })
})
