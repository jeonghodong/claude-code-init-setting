---
name: i18n/Multilingual Manager
description: 다국어(한국어/영어) 지원을 관리합니다. 새 콘텐츠에 다국어 텍스트 추가, LanguageContext 사용, 번역 누락 확인에 사용합니다. "다국어", "번역", "i18n", "한국어", "영어", "language", "internationalization" 키워드에 반응합니다.
---

# i18n/Multilingual Manager

## Purpose

포트폴리오 프로젝트의 다국어(한국어/영어) 지원을 체계적으로 관리합니다. 새 콘텐츠 추가 시 양쪽 언어를 일관되게 유지하고, LanguageContext를 올바르게 사용합니다.

## When to Use

- 새로운 텍스트 콘텐츠를 추가할 때
- 기존 텍스트를 수정할 때
- 번역 누락을 확인할 때
- 다국어 컴포넌트를 작성할 때
- 언어 전환 기능을 구현할 때

## Instructions

### 1. 프로젝트 다국어 구조 이해

이 프로젝트는 `_ko`, `_en` 접미사 패턴을 사용합니다:

```typescript
interface Project {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  longDescription_ko: string;
  longDescription_en: string;
}
```

### 2. LanguageContext 사용법

```tsx
import { useLanguage } from '@/app/contexts/LanguageContext';

function Component() {
  const { language, toggleLanguage } = useLanguage();

  // language는 'ko' 또는 'en'
  return (
    <div>
      <p>{project[`description_${language}`]}</p>
      <button onClick={toggleLanguage}>
        {language === 'ko' ? 'English' : '한국어'}
      </button>
    </div>
  );
}
```

## Process

1. **확인**: 기존 다국어 데이터 구조 파악
2. **작성**: 양쪽 언어 텍스트 모두 작성
3. **적용**: LanguageContext를 사용한 동적 텍스트 표시
4. **검증**: 양쪽 언어 모두 올바르게 표시되는지 확인

## Best Practices

### 새 프로젝트 데이터 추가

```typescript
// app/lib/data.ts
export const projects: Project[] = [
  {
    id: 'new-project',
    title: 'New Project', // 기본값 (영어)
    title_ko: '새 프로젝트',
    title_en: 'New Project',
    description: 'Short description',
    description_ko: '짧은 설명입니다.',
    description_en: 'Short description.',
    longDescription_ko: `
      ## 개요
      프로젝트에 대한 자세한 설명...

      ## 주요 기능
      - 기능 1
      - 기능 2

      ## 기술 스택
      React, TypeScript...
    `,
    longDescription_en: `
      ## Overview
      Detailed description of the project...

      ## Key Features
      - Feature 1
      - Feature 2

      ## Tech Stack
      React, TypeScript...
    `,
    // ... other fields
  },
];
```

### 다국어 컴포넌트 패턴

```tsx
'use client';

import { useLanguage } from '@/app/contexts/LanguageContext';

interface MultilingualTextProps {
  ko: string;
  en: string;
  className?: string;
}

function MultilingualText({ ko, en, className }: MultilingualTextProps) {
  const { language } = useLanguage();
  return <span className={className}>{language === 'ko' ? ko : en}</span>;
}

// 사용 예
<MultilingualText
  ko="안녕하세요"
  en="Hello"
  className="text-lg font-bold"
/>
```

### 동적 텍스트 접근

```tsx
function ProjectCard({ project }: { project: Project }) {
  const { language } = useLanguage();

  // 타입 안전한 동적 키 접근
  const getLocalizedField = <K extends keyof Project>(
    baseKey: string
  ): string => {
    const key = `${baseKey}_${language}` as K;
    return project[key] as string;
  };

  return (
    <div>
      <h2>{getLocalizedField('title')}</h2>
      <p>{getLocalizedField('description')}</p>
    </div>
  );
}
```

### 날짜/숫자 포맷

```tsx
function FormattedDate({ date }: { date: Date }) {
  const { language } = useLanguage();

  return (
    <span>
      {date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  );
}

// 한국어: 2024년 1월 15일
// 영어: January 15, 2024
```

### 복수형 처리

```tsx
function ItemCount({ count }: { count: number }) {
  const { language } = useLanguage();

  if (language === 'ko') {
    return <span>{count}개 항목</span>;
  }

  // 영어는 복수형 처리
  return <span>{count} {count === 1 ? 'item' : 'items'}</span>;
}
```

### UI 텍스트 상수

```typescript
// app/lib/constants.ts
export const UI_TEXT = {
  navigation: {
    home: { ko: '홈', en: 'Home' },
    about: { ko: '소개', en: 'About' },
    projects: { ko: '프로젝트', en: 'Projects' },
    contact: { ko: '연락처', en: 'Contact' },
  },
  buttons: {
    viewMore: { ko: '더 보기', en: 'View More' },
    close: { ko: '닫기', en: 'Close' },
    submit: { ko: '제출', en: 'Submit' },
  },
  messages: {
    loading: { ko: '로딩 중...', en: 'Loading...' },
    error: { ko: '오류가 발생했습니다', en: 'An error occurred' },
    success: { ko: '성공!', en: 'Success!' },
  },
};

// 사용
function Button() {
  const { language } = useLanguage();
  return <button>{UI_TEXT.buttons.viewMore[language]}</button>;
}
```

## Validation Checklist

새 콘텐츠 추가 시 확인:

- [ ] `_ko` 필드 작성 완료
- [ ] `_en` 필드 작성 완료
- [ ] 양쪽 언어의 의미가 일치
- [ ] 마크다운 포맷이 동일 (헤딩, 리스트 등)
- [ ] 특수문자, 이모지 동일하게 적용
- [ ] 길이가 크게 차이나지 않음 (UI 레이아웃 고려)

## Common Issues

### 번역 누락 감지

```typescript
// 개발 중 누락된 번역 감지
function getLocalized(obj: any, key: string, language: string): string {
  const localizedKey = `${key}_${language}`;
  const value = obj[localizedKey];

  if (!value) {
    console.warn(`Missing translation: ${localizedKey}`);
    // fallback to other language or base key
    return obj[`${key}_${language === 'ko' ? 'en' : 'ko'}`] || obj[key] || '';
  }

  return value;
}
```

### 언어 지속성 (localStorage)

```tsx
// contexts/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en';

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  // localStorage에서 언어 설정 로드
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

### SEO 다국어 메타데이터

```tsx
// app/layout.tsx
import { useLanguage } from '@/contexts/LanguageContext';

export function generateMetadata() {
  return {
    title: {
      default: 'Portfolio | 포트폴리오',
      template: '%s | Portfolio'
    },
    alternates: {
      languages: {
        'ko': '/ko',
        'en': '/en',
      },
    },
  };
}
```

## Error Handling

- **Context 에러**: LanguageProvider가 상위에 있는지 확인
- **타입 에러**: 동적 키 접근 시 타입 단언 필요
- **Hydration 불일치**: 초기 언어 값은 서버와 클라이언트 동일하게

## Output Format

다국어 콘텐츠 추가 후:
1. 추가된 필드 목록 (ko/en)
2. 번역 품질 검토 결과
3. UI 레이아웃 영향 분석
