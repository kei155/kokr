# KOKR
개발을 하다보면 숱하게 마주치게 되는, *아, 없어도 되는데 있으면 좋겠다-* 처리를 도와주는 한글 가공 유틸리티 패키지입니다.

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

## 테스트 Run tests
```sh
npm run test
```

## 작성자 Author
#### 👤 Gardeneel
- Github [@kei155](https://github.com/kei155)

## 라이센스 License
Copyright @ 2023 [Gardeneel](https://github.com/kei155).
This project is [MIT](https://opensource.org/license/mit/) licensed.