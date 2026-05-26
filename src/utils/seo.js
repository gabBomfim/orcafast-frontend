const SITE_ORIGIN = 'https://orcafast.com.br'

const buildAbsoluteLink = (path) => {
  if (!path) return SITE_ORIGIN
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

const upsertHeadElement = ({ selector, tagName, attributes, textContent }) => {
  if (typeof document === 'undefined') return () => {}

  let element = document.head.querySelector(selector)
  const wasCreated = !element

  if (!element) {
    element = document.createElement(tagName)
    document.head.appendChild(element)
  }

  const previousAttributes = {}

  Object.entries(attributes).forEach(([name, value]) => {
    previousAttributes[name] = element.getAttribute(name)
    element.setAttribute(name, value)
  })

  const previousTextContent = element.textContent

  if (typeof textContent === 'string') {
    element.textContent = textContent
  }

  return () => {
    if (wasCreated) {
      element.remove()
      return
    }

    Object.entries(previousAttributes).forEach(([name, value]) => {
      if (value === null) {
        element.removeAttribute(name)
        return
      }

      element.setAttribute(name, value)
    })

    if (typeof textContent === 'string') {
      element.textContent = previousTextContent
    }
  }
}

export const applyPageSeo = ({
  title,
  description,
  path,
  ogTitle = title,
  ogDescription = description,
  twitterTitle = ogTitle,
  twitterDescription = ogDescription,
  schema,
}) => {
  if (typeof document === 'undefined') return () => {}

  const absoluteLink = buildAbsoluteLink(path)
  const previousTitle = document.title
  document.title = title

  const cleanup = [
    upsertHeadElement({
      selector: 'meta[name="description"]',
      tagName: 'meta',
      attributes: { name: 'description', content: description },
    }),
    upsertHeadElement({
      selector: 'meta[property="og:type"]',
      tagName: 'meta',
      attributes: { property: 'og:type', content: 'website' },
    }),
    upsertHeadElement({
      selector: 'meta[property="og:url"]',
      tagName: 'meta',
      attributes: { property: 'og:url', content: absoluteLink },
    }),
    upsertHeadElement({
      selector: 'meta[property="og:title"]',
      tagName: 'meta',
      attributes: { property: 'og:title', content: ogTitle },
    }),
    upsertHeadElement({
      selector: 'meta[property="og:description"]',
      tagName: 'meta',
      attributes: { property: 'og:description', content: ogDescription },
    }),
    upsertHeadElement({
      selector: 'meta[name="twitter:card"]',
      tagName: 'meta',
      attributes: { name: 'twitter:card', content: 'summary_large_image' },
    }),
    upsertHeadElement({
      selector: 'meta[name="twitter:title"]',
      tagName: 'meta',
      attributes: { name: 'twitter:title', content: twitterTitle },
    }),
    upsertHeadElement({
      selector: 'meta[name="twitter:description"]',
      tagName: 'meta',
      attributes: { name: 'twitter:description', content: twitterDescription },
    }),
    upsertHeadElement({
      selector: 'link[rel="canonical"]',
      tagName: 'link',
      attributes: { rel: 'canonical', href: absoluteLink },
    }),
  ]

  if (schema) {
    cleanup.push(
      upsertHeadElement({
        selector: 'script[data-page-schema="faq"]',
        tagName: 'script',
        attributes: {
          type: 'application/ld+json',
          'data-page-schema': 'faq',
        },
        textContent: JSON.stringify(schema),
      })
    )
  }

  return () => {
    document.title = previousTitle
    cleanup.forEach((restore) => restore())
  }
}
