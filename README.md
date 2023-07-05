![GitHub](https://img.shields.io/github/license/kei155/kokr)
![npm](https://img.shields.io/npm/v/%40owneul%2Fkokr)
![npm](https://img.shields.io/npm/dm/%40owneul%2Fkokr)
![npm type definitions](https://img.shields.io/npm/types/%40owneul%2Fkokr)
![GitHub Release Date - Published_At](https://img.shields.io/github/release-date/kei155/kokr)


# KOKR
개발을 하다보면 숱하게 마주치게 되는, *아, 없어도 되는데 있으면 좋겠다-* 처리를 도와주는 한글 가공 유틸리티 패키지입니다. <br />
It is a Hangul(korean) processing utility package that helps you process *Oh, i don't need it, but I hope i have it-*, which you encounter a lot while programming.

## 설치 Installation
```sh
npm install @owneul/kokr
```

## 사용 Usage

### Typescript
```typescript
import { decideJosa } from '@owneul/kokr'

console.log(decideJosa(`폭발은(는) 예술이다`)) 
// 폭발은 예술이다

console.log(decideJosa(`범(이/가) 내려와 물을/를 마셨어`)) 
// 범이 내려와 물을 마셨어
```

## API
### decideJosa()
```typescript
/**
 * 주어진 문장에서 결정되지 않은 조사를 걸러내 돌려준다.
 * @param textContainingImpurities 불순물(결정되지 않은 조사)을 포함한 문자열
 * @param filterOptions 세부 옵션
 * @returns 결정되지 않은 조사를 결정, 걸러낸 결과
 */
import { decideJosa } from '@owneul/kokr'

decideJosa('공부은(는) 즐겁습니다') // 공부는 즐겁습니다
decideJosa('사실(은/는) 거짓말입니다') // 사실은 거짓말입니다

/** 특정 문자열 치환 제외 */
decideJosa(`'공부은(는) 즐겁습니다'라는 거짓말을/를 했습니다`, {
    except: [`'공부은(는) 즐겁습니다'`]
}) // '공부은(는) 즐겁습니다'라는 거짓말을 했습니다

/** 정규식으로 치환 제외 */
decideJosa(`'공부은(는) 즐겁습니다'라는 거짓말을/를 했습니다`, {
    except: [/'.*은\(는\).*'/]
}) // '공부은(는) 즐겁습니다'라는 거짓말을 했습니다
```

### numToKor()
```typescript
/**
 * 주어진 숫자를 한글 문자열로 변환
 * @param number 한글로 변환할 숫자
 * @param translateType 변환 유형 구분
 * @returns 변환된 문자열
 */
import { numToKor } from '@owneul/kokr'

/**
 * translateType DEFAULT
 * 관례에 따름(천만 단위까지는 '일'을 생략, 억 단위부터는 '일'을 생략 않음)
 */
numToKor(14_403_221) // 천사백사십만삼천이백이십일
numToKor(111_111_111) // 일억천백십일만천백십일
numToKor(1_000_000_000) // 십억


/**
 * translateType INCLUDE_ONE
 * 모든 경우에 '일'을 읽기 생략하지 않음
 */
numToKor(14_403_221, 'INCLUDE_ONE') // 일천사백사십만삼천이백이십일
numToKor(111_111_111, 'INCLUDE_ONE') // 일억일천일백일십일만일천일백일십일
numToKor(1_000_000_000, 'INCLUDE_ONE') // 일십억


/**
 * translateType EXCEPT_ONE
 * 모든 경우에 '일'을 읽기 생략함
 */
numToKor(14_403_221, 'EXCEPT_ONE') // 천사백사십만삼천이백이십일
numToKor(111_111_111, 'EXCEPT_ONE') // 억천백십일만천백십일
numToKor(1_000_000_000, 'EXCEPT_ONE') // 십억

/**
 * translateType EACH
 * 단위로 읽지 않고 개별 숫자를 읽기 (전화번호, 우편번호 등)
 */
numToKor(14_403_221, 'EXCEPT_ONE') // 천사백사십만삼천이백이십일
numToKor(111_111_111, 'EXCEPT_ONE') // 억천백십일만천백십일
numToKor(1_000_000_000, 'EXCEPT_ONE') // 십억

```

### korToNum()
```typescript
/**
 * 주어진 한글 문자열을 숫자로 변환
 * @param korText 숫자로 추정하는 한글 문자열
 * @returns 변환된 숫자값
 * @throws 숫자로 변환할 수 없는 값일 때
 */
import { korToNum } from '@owneul/kokr'

korToNum('삼천칠백억오천구백육십삼만칠천팔백칠십육') // 370_059_637_876
korToNum('일억구천만삼십사') // 190_000_034
korToNum('천백만오') // 11_000_005
korToNum('일삼오육삼이칠사공일칠일') // 135_632_740_171
```

## 테스트 Run tests
```sh
npm run test
```

## 작성자 Author
#### 👤 Gardeneel
- Github [@kei155](https://github.com/kei155)

## 라이센스 License
Copyright @ 2023 [Gardeneel](https://github.com/kei155).<br/>
This project is [MIT](https://opensource.org/license/mit/) licensed.