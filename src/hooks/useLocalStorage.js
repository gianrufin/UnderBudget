import { useEffect, useRef, useState } from 'react'

/**
 * A useState-like hook that persists its value to localStorage.
 *
 * @param {string} key      The localStorage key.
 * @param {*} initialValue  Default used when nothing is stored yet.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue))

  // Keep the latest key in a ref so the write effect can react to key changes.
  const keyRef = useRef(key)
  keyRef.current = key

  useEffect(() => {
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value))
    } catch {
      // Storage full or unavailable (e.g. private mode) — fail silently so the
      // app keeps working from in-memory state.
    }
  }, [value])

  // Sync updates coming from other tabs/windows.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key) return
      setValue(
        event.newValue
          ? safeParse(event.newValue, resolveInitial(initialValue))
          : resolveInitial(initialValue),
      )
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, setValue]
}

/** Resolve a possibly-lazy initial value (supports useState-style functions). */
function resolveInitial(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue
}

function readStored(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? resolveInitial(initialValue) : safeParse(raw, resolveInitial(initialValue))
  } catch {
    return resolveInitial(initialValue)
  }
}

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}
