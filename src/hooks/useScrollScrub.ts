import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHypercarStore } from '../store/useHypercarStore';

/**
 * Connects continuous scroll gestures to the 3D explode progress
 * using GSAP tweening with custom easing curves.
 */
export function useScrollScrub() {
  const setExplodeProgress = useHypercarStore((s) => s.setExplodeProgress);
  const explodeProgress = useHypercarStore((s) => s.explodeProgress);
  const currentProgress = useRef(explodeProgress);

  useEffect(() => {
    currentProgress.current = explodeProgress;
  }, [explodeProgress]);

  useEffect(() => {
    let targetVal = currentProgress.current;

    const handleWheel = (e: WheelEvent) => {
      // Delta normalization across trackpads and stepped wheels
      const delta = e.deltaY * 0.0008;
      targetVal = Math.max(0, Math.min(1, targetVal + delta));

      gsap.to(currentProgress, {
        current: targetVal,
        duration: 0.45,
        ease: 'power2.out',
        onUpdate: () => {
          setExplodeProgress(currentProgress.current);
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [setExplodeProgress]);
}
