import { useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unsubscribe')({
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const search = useSearch({ from: '/unsubscribe' })
  const token = (search as Record<string, unknown>).token as string | undefined

  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'confirmed' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      setMessage('Nieprawidłowy link. Brak tokenu weryfikacyjnego.')
      return
    }

    setStatus('checking')
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then((res) => {
        if (res.ok) {
          setStatus('valid')
        } else {
          setStatus('invalid')
          setMessage('Link wygasł lub jest nieprawidłowy.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Wystąpił błąd podczas weryfikacji. Spróbuj ponownie później.')
      })
  }, [token])

  const handleConfirm = async () => {
    if (!token) return
    try {
      const res = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        setStatus('confirmed')
        setMessage('Adres e-mail został usunięty z listy.')
      } else {
        setStatus('error')
        setMessage('Nie udało się zrealizować żądania. Spróbuj ponownie.')
      }
    } catch {
      setStatus('error')
      setMessage('Wystąpił błąd. Spróbuj ponownie później.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-champagne">E-mail</div>
        <h1 className="mt-4 font-serif text-3xl text-ink">
          {status === 'confirmed' ? 'Wypisano pomyślnie' : 'Wypisz się z listy'}
        </h1>

        {status === 'checking' && (
          <p className="mt-3 text-sm text-muted-foreground">Weryfikacja linku…</p>
        )}

        {status === 'valid' && (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Potwierdź, że chcesz wypisać swój adres e-mail z listy mailingowej.
            </p>
            <button
              onClick={handleConfirm}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-ink px-6 text-sm tracking-wide text-alabaster"
            >
              Potwierdź wypisanie
            </button>
          </>
        )}

        {(status === 'invalid' || status === 'error') && (
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        )}

        {status === 'confirmed' && (
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  )
}
