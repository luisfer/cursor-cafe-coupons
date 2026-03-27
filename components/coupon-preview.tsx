'use client'

import { useRef, useEffect, useState } from 'react'

interface CouponPreviewProps {
  html: string
}

/** Visual zoom so the 480px coupon reads larger in the panel */
const PREVIEW_SCALE = 1.22

export function CouponPreview({ html }: CouponPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(400)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    doc.open()
    doc.write(html)
    doc.close()

    const checkHeight = () => {
      const body = doc.body
      if (body) {
        const h = body.scrollHeight
        if (h > 0) setHeight(h + 20)
      }
    }

    const timer = setTimeout(checkHeight, 100)
    return () => clearTimeout(timer)
  }, [html])

  const scaledHeight = Math.ceil(height * PREVIEW_SCALE)

  return (
    <div className="w-full max-w-[640px] mx-auto flex justify-center">
      <div className="relative" style={{ width: 520 * PREVIEW_SCALE, height: scaledHeight }}>
        <div
          className="absolute left-1/2 top-0 rounded-lg overflow-hidden shadow-2xl bg-white"
          style={{
            transform: `translateX(-50%) scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <iframe
            ref={iframeRef}
            title="Coupon preview"
            className="block border-0"
            style={{ width: 520, height }}
          />
        </div>
      </div>
    </div>
  )
}
