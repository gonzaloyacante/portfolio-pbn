import PublicContactPage from '@/components/features/contact/public/PublicContactPage'
import { getPublicContactPageData } from '@/components/features/contact/public/contactPageData'
import { generateContactPageMetadata } from '@/components/features/contact/public/contactPageMetadata'

/** Cache público — invalidación explícita desde CMS. */
export const revalidate = false

export async function generateMetadata() {
  return generateContactPageMetadata()
}

export default async function ContactPage() {
  const data = await getPublicContactPageData()
  return <PublicContactPage {...data} />
}
