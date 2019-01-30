import Prismic from 'prismic-javascript'

export default class PrismicLoader {
  constructor (config) {
    this.config = config
  }

  connect () {
    const accessToken = this.config.accessToken
    return new Promise((resolve, reject) => {
      return Prismic.api(this.config.apiEndpoint, { accessToken })
        .then(api => {
          const linkResolver = this.config.linkResolver ? this.config.linkResolver : () => '/'
          this.prismic = {
            api,
            endpoint: this.config.apiEndpoint,
            accessToken,
            linkResolver
          }

          return resolve(this.prismic)
        })
    })
  }

  fetchAll () {
    const query = ''
    const options = {
      lang: '*',
      pageSize: 100 // this is the max
    }

    return this.fetchAllPage(query, options, 1)
      .then(documents => this.fetchMoreIfNeedBe(documents, query, options))
  }

  fetchMoreIfNeedBe (documents, query, options) {
    const totalPages = documents.total_pages
    const totalDocuments = documents.total_results_size

    console.log(`Prismic: ${totalDocuments} documents exist across ${totalPages} pages of size ${options.pageSize}`)

    // check the total number of pages
    if (!totalPages || totalPages === 1) {
      return Promise.resolve([documents])
    }

    return Promise.all([...Array(totalPages - 1)].map((item, index) => this.fetchAllPage(query, options, index + 2)))
      .then(additionalDocuments => [documents, ...additionalDocuments])
  }

  fetchAllPage (query, options, page) {
    const pageOptions = Object.assign({}, options, {page})
    return this.prismic.api.query(query, pageOptions)
      .catch(error => console.error(error))
  }

  fetchEach () {
    return this.fetchAll()
      .then(documents => this.parseDocuments(documents))
  }

  fetch (documentQuery, options = {}) {
    const prismicQuery = Object.keys(documentQuery).map(key => Prismic.Predicates.at(key, documentQuery[key]))
    return this.prismic.api.query(prismicQuery, options)
      .then(documents => this.parseDocuments(documents))
      .catch(error => console.error(error))
  }

  fetchPage (uid) {
    return this.prismic.api.getByUID('event', uid, {}, (err, doc) => {
      if (err) {
        // this.setState({ err });
        console.error('ERROR', err)
        return err
      }
      if (doc) {
        // We put the retrieved content in the state as a doc variable
        console.log('DOC', doc)
        // this.setState({ doc });
      } else {
        // We changed the state to display error not found if no matched doc
        // this.setState({ notFound: !doc });
        console.log('NOT FOUND')
      }
      return doc
    })
  }

  safePage (page) {
    const escapedPage = JSON.stringify(page)
    const safePage = escapedPage.replace(/\u2028/g, '\\n')
    return JSON.parse(safePage)
  }

  parseDocuments (documents) {
    const pages = {}

    const results = []
    documents.forEach(document => {
      results.push(...document.results)
    })

    results.forEach(page => {
      const safePage = this.safePage(page)
      pages[page.id] = safePage
    })

    return pages
  }

  previewSession (token, resolver = (page) => page) {
    return this.prismic.api.previewSession(token, resolver, '/')
      .catch(error => {
        console.error('Prismic.previewSession error', error)
        return Promise.reject(error)
      })
  }
}
