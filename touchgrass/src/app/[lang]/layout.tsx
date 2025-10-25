import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import Navbar from '@/components/Navbar'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }))
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Validate that the incoming `lang` parameter is valid
  if (!locales.includes(params.lang as Locale)) {
    notFound()
  }

  const locale = params.lang as Locale

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar locale={locale} />
      <main>{children}</main>
    </div>
  )
}