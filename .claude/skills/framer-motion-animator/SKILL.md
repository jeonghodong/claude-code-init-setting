---
name: Framer Motion Animation Designer
description: Framer Motion을 사용한 부드럽고 인터랙티브한 UI 애니메이션을 구현합니다. 트랜지션, 제스처, 레이아웃 애니메이션, 스크롤 기반 애니메이션에 사용합니다. "애니메이션", "트랜지션", "Framer Motion", "모션", "제스처", "스크롤 애니메이션" 키워드에 반응합니다.
---

# Framer Motion Animation Designer

## Purpose

Framer Motion을 활용하여 사용자 경험을 향상시키는 부드럽고 자연스러운 UI 애니메이션을 구현합니다. 성능을 유지하면서 시각적으로 매력적인 인터랙션을 만듭니다.

## When to Use

- UI 요소에 등장/퇴장 애니메이션이 필요할 때
- 호버, 탭 등 제스처 반응이 필요할 때
- 레이아웃 변경 시 부드러운 전환이 필요할 때
- 스크롤에 반응하는 애니메이션이 필요할 때
- 복잡한 시퀀스 애니메이션이 필요할 때

## Instructions

### 1. 기본 애니메이션 설정

```tsx
import { motion } from 'framer-motion';

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      Content
    </motion.div>
  );
}
```

### 2. 애니메이션 유형 결정

- **Simple**: `initial`, `animate` 속성
- **Gesture**: `whileHover`, `whileTap`
- **Scroll**: `whileInView`, `useScroll`
- **Layout**: `layout` 속성
- **Complex**: variants 시스템

## Process

1. **분석**: 원하는 애니메이션 효과 파악
2. **설계**: 애니메이션 타이밍과 이징 결정
3. **구현**: 적절한 Framer Motion 패턴 적용
4. **최적화**: 성능 확인 및 조정

## Best Practices

### Variants로 복잡한 애니메이션 관리

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

function List({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 제스처 인터랙션

```tsx
function InteractiveCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      Interactive Card
    </motion.div>
  );
}
```

### 스크롤 기반 애니메이션

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.section ref={ref} style={{ y, opacity }}>
      Parallax Content
    </motion.section>
  );
}
```

### 뷰포트 진입 애니메이션

```tsx
function FadeInOnScroll({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### 레이아웃 애니메이션

```tsx
import { motion, LayoutGroup } from 'framer-motion';

function ExpandableList() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <LayoutGroup>
      {items.map((item) => (
        <motion.div
          key={item.id}
          layout
          onClick={() => setSelected(item.id === selected ? null : item.id)}
          style={{ borderRadius: 12 }}
        >
          <motion.h3 layout="position">{item.title}</motion.h3>
          {selected === item.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {item.content}
            </motion.div>
          )}
        </motion.div>
      ))}
    </LayoutGroup>
  );
}
```

### AnimatePresence로 퇴장 애니메이션

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 커스텀 이징

```tsx
// Spring 애니메이션 (자연스러운 움직임)
transition={{ type: 'spring', stiffness: 300, damping: 30 }}

// Tween 애니메이션 (정확한 타이밍)
transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}

// 커스텀 이징 프리셋
const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
};
```

## Performance Tips

### GPU 가속 속성 사용

```tsx
// Good - GPU 가속
animate={{ opacity, scale, x, y, rotate }}

// Avoid - 레이아웃 트리거
animate={{ width, height, top, left }}
```

### will-change 힌트

```tsx
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

### 조건부 애니메이션

```tsx
function Component({ shouldAnimate }) {
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
    />
  );
}
```

## Common Issues

### AnimatePresence 작동 안함

```tsx
// Bad - key 없음
<AnimatePresence>
  {isVisible && <motion.div>...</motion.div>}
</AnimatePresence>

// Good - key 필수
<AnimatePresence>
  {isVisible && <motion.div key="unique">...</motion.div>}
</AnimatePresence>
```

### 레이아웃 애니메이션 깨짐

```tsx
// borderRadius가 레이아웃과 함께 변형되면 깨질 수 있음
// 인라인 style로 고정
<motion.div layout style={{ borderRadius: 12 }}>
  ...
</motion.div>
```

## Error Handling

- **Hydration error**: 클라이언트 전용 로직은 useEffect에서 처리
- **Performance issues**: 불필요한 리렌더링 방지, GPU 가속 속성 사용
- **Layout shift**: layout 속성 사용 시 부모 요소에도 적용 검토

## Output Format

구현 후 다음을 보고:
1. 적용된 애니메이션 효과
2. 사용된 이징 및 타이밍
3. 성능 최적화 적용 여부
