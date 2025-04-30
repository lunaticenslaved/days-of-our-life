import { useEffect, useState } from 'react';

export function useFocusWithin(ref: React.RefObject<Element>) {
  const [isFocused, setIsFocused] = useState<boolean | undefined>(false);

  useEffect(() => {
    const el = ref.current;

    function hasFocusWithin(element: Element | null): boolean {
      if (!element || !document) return false;
      return element?.contains(document.activeElement);
    }

    function onFocusIn() {
      if (!el) {
        setIsFocused(false);
      } else {
        const newIsFocusWithin = hasFocusWithin(el);

        setIsFocused(newIsFocusWithin);
      }
    }

    function onFocusOut() {
      setIsFocused(false);
    }

    el?.addEventListener('focusin', onFocusIn, false);
    el?.addEventListener('focusout', onFocusOut, false);

    return () => {
      el?.removeEventListener('focusin', onFocusIn, false);
      el?.removeEventListener('focusout', onFocusOut, false);
    };
  }, [ref]);

  return isFocused;
}
