import { RefObject, useCallback, useEffect, useState } from 'react';

export function usePendingCall(call: () => Promise<void> | void) {
  const [isPending, setIsPending] = useState(false);

  const callLocal = useCallback(async () => {
    setIsPending(true);

    try {
      await call();
    } catch (error) {
      setIsPending(false);

      throw error;
    } finally {
      setIsPending(false);
    }
  }, [call]);

  return [isPending, callLocal] as const;
}

export function useClickOutside(
  elementRef: RefObject<Element> | RefObject<Element>[],
  callback: (event: MouseEvent) => void,
) {
  useEffect(() => {
    function call(event: MouseEvent) {
      const forElement = (element: RefObject<Element>) => {
        if (!element.current) {
          return false;
        }

        if (!event.target || element.current.contains(event.target as Node)) {
          return false;
        }

        return true;
      };

      let isClickedOutside = false;

      if (Array.isArray(elementRef)) {
        isClickedOutside = elementRef.every(forElement);
      } else {
        isClickedOutside = forElement(elementRef);
      }

      if (isClickedOutside) {
        callback(event);
      }
    }

    document.addEventListener('click', call);

    return () => {
      document.removeEventListener('click', call);
    };
  }, [callback, elementRef]);
}
