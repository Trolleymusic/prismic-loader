# prismic-loader

How to use:

```javascript
import PrismicLoader from 'prismic-loader'

const apiEndpoint = 'https://repo-name.cdn.prismic.io/api/v2'
// If your Prismic repository is set to Public, you do not need to supply a token
const accessToken = 'xxxxxxxxxxx'

const prismicConfig = { apiEndpoint, accessToken }

const getPrismicPages = async (templates = defaultTemplates) => {
  const prismic = new PrismicLoader(prismicConfig)
  await prismic.connect()
  const pages = await prismic.fetchEach()
  // pages is a prismic uid keyed object
}
```

`fetchEach` is designed to be a single-shot get-all-pages in a single object that can then be iterated through to create pages.

If you want to save the `pages` object to refer to later, I usually find it better to save a specific subset that you're going to use as it greatly reduces the amount of data you need to keep.
