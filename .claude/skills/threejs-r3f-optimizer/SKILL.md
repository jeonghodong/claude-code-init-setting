---
name: Three.js/R3F Performance Optimizer
description: Three.js와 React Three Fiber 3D 컴포넌트의 성능을 최적화합니다. 메모리 누수 방지, geometry/material 재사용, 모바일 최적화, FPS 개선이 필요할 때 사용합니다. "3D 성능", "Three.js 최적화", "R3F", "렌더링 성능", "메모리 누수" 키워드에 반응합니다.
---

# Three.js/R3F Performance Optimizer

## Purpose

3D 웹 애플리케이션의 성능을 최적화하여 부드러운 60fps 렌더링과 효율적인 메모리 사용을 달성합니다. React Three Fiber 패턴에 맞는 최적화 기법을 적용합니다.

## When to Use

- 3D 씬의 FPS가 낮거나 끊김 현상이 있을 때
- 메모리 사용량이 계속 증가할 때 (메모리 누수)
- 모바일 기기에서 성능이 저하될 때
- 새로운 3D 컴포넌트를 작성할 때
- geometry나 material 최적화가 필요할 때

## Instructions

### 1. 성능 진단

```tsx
// Stats 컴포넌트로 FPS 모니터링
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* 씬 컴포넌트들 */}
</Canvas>
```

### 2. 메모리 최적화 체크리스트

- [ ] useEffect cleanup에서 dispose() 호출
- [ ] geometry와 material을 useMemo로 캐싱
- [ ] 텍스처 사용 후 dispose
- [ ] 이벤트 리스너 정리

### 3. 렌더링 최적화 체크리스트

- [ ] useMemo로 정적 데이터 메모이제이션
- [ ] useCallback으로 핸들러 최적화
- [ ] frameloop="demand"로 필요시에만 렌더링
- [ ] instancing 사용 (동일 geometry 반복)

## Process

1. **분석**: 현재 3D 컴포넌트 구조 파악
2. **진단**: 성능 병목 지점 식별
3. **최적화**: 아래 패턴 적용
4. **검증**: Stats로 개선 확인

## Best Practices

### Geometry/Material 재사용

```tsx
function OptimizedMeshes() {
  // geometry와 material을 한 번만 생성
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'blue' }), []);

  // cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <>
      <mesh geometry={geometry} material={material} position={[0, 0, 0]} />
      <mesh geometry={geometry} material={material} position={[2, 0, 0]} />
    </>
  );
}
```

### useFrame 최적화

```tsx
function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  // delta를 사용해 프레임 독립적 애니메이션
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return <mesh ref={meshRef}>...</mesh>;
}
```

### 모바일 감지 및 품질 조절

```tsx
function AdaptiveScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !isMobile }}
    >
      <ParticleSystem count={isMobile ? 100 : 500} />
    </Canvas>
  );
}
```

### Instancing으로 대량 객체 처리

```tsx
function InstancedBoxes({ count = 1000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const temp = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      temp.position.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
      temp.updateMatrix();
      meshRef.current?.setMatrixAt(i, temp.matrix);
    }
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
```

## Common Issues

### 메모리 누수 패턴

```tsx
// Bad - dispose 없음
useEffect(() => {
  const texture = new THREE.TextureLoader().load('image.png');
  setTexture(texture);
}, []);

// Good - cleanup 포함
useEffect(() => {
  const texture = new THREE.TextureLoader().load('image.png');
  setTexture(texture);
  return () => texture.dispose();
}, []);
```

### 불필요한 리렌더링

```tsx
// Bad - 매 렌더마다 새 객체 생성
<mesh position={[0, 0, 0]} />

// Good - 정적 값 캐싱
const position = useMemo(() => [0, 0, 0] as const, []);
<mesh position={position} />
```

## Error Handling

- `WebGL context lost`: 리소스 정리 후 context 복구
- `Out of memory`: 텍스처 크기 줄이기, 불필요한 객체 dispose
- `Maximum call stack`: useFrame 내 무한 루프 확인

## Output Format

최적화 후 다음을 보고:
1. 적용된 최적화 기법 목록
2. 예상 성능 개선 효과
3. 추가 권장 사항
