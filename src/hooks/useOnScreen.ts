import { useEffect, useRef, useState } from "react";

export function useOnScreen<T extends Element>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(ref.current);

    const reference = ref.current;

    return () => {
      if (reference) observer.unobserve(reference);
    };
  }, [ref, options]);

  return { ref, isIntersecting };
}
