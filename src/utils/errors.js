import toast from 'react-hot-toast'

export function toastApiError(err, fallback = 'Something went wrong') {
  const d = err.response?.data?.detail
  let msg = fallback
  if (typeof d === 'string') {
    msg = d
  } else if (Array.isArray(d)) {
    msg = d
      .map((x) => (typeof x === 'string' ? x : x.msg || JSON.stringify(x)))
      .join(', ')
  } else if (d && typeof d === 'object') {
    msg = d.error || d.message || (d.detail && String(d.detail)) || fallback
  } else if (err.message) {
    msg = err.message
  }
  toast.error(msg)
}
