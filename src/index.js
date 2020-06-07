import Prismic from 'prismic-javascript'

const defaultLinkResolver = (page) => (page.uid || '/')

/**
 * Convenient loader for Prismic
 *
 * @class
 * @requires 'prismic-javascript'
 * @todo Tests
 * @example
 * import PrismicLoader from 'prismic-loader'
 *
 * const accessToken = 'PRISMIC ACCESS TOKEN'
 * const apiEndpoint = 'https://repo.cdn.prismic.io/api/v2'
 * const prismicLoader = new PrismicLoader({ accessToken, apiEndpoint })
 *
 * @param {Object} options
 * @param {string} options.accessToken - The access token used to communicate with the Prismic API (https://user-guides.prismic.io/en/articles/1036153-generating-an-access-token)
 * @param {string} options.apiEndpoint - The Prismic API endpoint for your repository (https://prismic.io/docs/rest-api/basics/introduction-to-the-content-query-api#4_1-the-api-search-endpoint)
 * @param {Object} [options.logger=console] - Logger
 * @param {Function} [options.linkResolver] - Prismic Link Resolver to use
 */
class PrismicLoader {
  constructor ({ accessToken, apiEndpoint, linkResolver = defaultLinkResolver, logger = console }) {
    this.config = { accessToken, apiEndpoint, linkResolver, logger }
  }

  /** Connect to the Prismic API
   *
   * @public
   * @async
   * @param {Object} [options={}]
   * @param {Object} [options.req] - The Request object
   * @returns {Promise<Object>} - Object containing the connected Prismic API instance
   */
  async connect ({ req } = {}) {
    const { accessToken, apiEndpoint } = this.config
    const options = { accessToken }
    if (req) {
      options.req = req
    }

    const api = await Prismic.api(apiEndpoint, options)
    this.setPrismic({ api })
  }

  /** Saves the connected Prismic API
   *
   * @private
   * @param {Object} options
   * @param {Object} options.api
   * @returns {Object} - Object containing the connected Prismic API
   */
  setPrismic ({ api }) {
    this.prismic = { api }
    return this.prismic
  }

  /** Fetch all documents
   *
   * @public
   * @async
   * @param {Object} [options]
   * @param {string} [options.lang='*'] - Language to query
   * @param {number} [options.pageSize=100] - Number of documents to fetch at a time
   * @returns {Promise<Array>} - An array of documents from Prismic
   */
  async fetchAll ({ lang = '*', pageSize = 100 } = {}) {
    const { logger } = this.config
    const query = ''
    const options = { lang }

    const { documents, totalDocuments, totalPages } = await this.fetchPage({ query, options, page: 1, pageSize })
    logger.log(`Prismic: ${totalDocuments} documents exist across ${totalPages} pages of size ${pageSize}`)

    if (!totalPages) {
      return []
    } else if (totalPages <= 1) {
      return documents
    }

    const additional = await Promise.all(
      new Array(totalPages - 1).fill().map(async (item, index) => {
        const { documents } = await this.fetchPage({ query, options, pageSize, page: index + 2 })
        return documents
      })
    )

    return documents.concat(...additional)
  }

  /** Fetch a page of documents from Prismic
   *
   * @private
   * @async
   * @param {Object} options
   * @param {string} options.query - Query
   * @param {number} options.page - Page to fetch
   * @param {number} options.pageSize - Number of documents in the page
   * @param {Object} options.options - Additional Prismic query options
   * @returns {Promise<Object>} - An object containing a documents array, totalDocuments, and totalPages
   */
  async fetchPage ({ query, page, pageSize, options }) {
    const { logger } = this.config
    try {
      const response = await this.prismic.api.query(query, { ...options, pageSize, page })
      const { total_pages: totalPages, total_results_size: totalDocuments, results: documents } = response
      return { documents, totalDocuments, totalPages }
    } catch (error) {
      logger.error('PrismicLoader.fetchPage error', error)
      throw error
    }
  }

  /** Fetch matching Prismic documents
   *
   * @public
   * @async
   * @param {Object} options
   * @param {string} options.query - Prismic query
   * @param {Object} options.options - Prismic query options
   * @returns {Promise<Array>} - Prismic documents
   */
  async fetch ({ query, options = {} }) {
    const { logger } = this.config
    const prismicQuery = Object.entries(query).map(([key, value]) =>
      Prismic.Predicates.at(key, value)
    )

    try {
      const documents = await this.prismic.api.query(prismicQuery, options)
      return documents.map(doc => this.escapeDoc(doc))
    } catch (error) {
      logger.error('PrismicLoader.fetch error', error)
      throw error
    }
  }

  /** Fetch all documents as indexed object
   *
   * @public
   * @async
   * @param {Object} [options]
   * @param {string} [options.lang='*'] - Language to query
   * @param {number} [options.pageSize=100] - Number of documents to fetch at a time
   * @returns {Promise<Object>} - id indexed Prismic documents
   */
  async fetchAllAsIndexed ({ lang = '*', pageSize = 100 } = {}) {
    const documents = await this.fetchAll({ lang, pageSize })
    return documents.reduce((indexed, doc) => {
      indexed[doc.id] = this.escapeDoc(doc)
      return indexed
    }, {})
  }

  /** Fetch documents as indexed object
   *
   * @public
   * @async
   * @param {Object} options
   * @param {string} options.query - Prismic query
   * @param {Object} options.options - Prismic query options
   * @returns {Promise<Object>} - id indexed Prismic documents
   */
  async fetchAsIndexed ({ query, options }) {
    const documents = await this.fetch({ query, options })
    return documents.reduce((indexed, doc) => {
      indexed[doc.id] = this.escapeDoc(doc)
      return indexed
    }, {})
  }

  /** Escape the content of a returned Prismic document
   *
   * @private
   * @param {Object} doc - Prismic document
   * @returns {Object} - An escaped Prismic document
   */
  escapeDoc (doc) {
    const escapedDoc = JSON.stringify(doc)
      .replace(/\u2028/g, '\\n')
    return JSON.parse(escapedDoc)
  }

  /** Preview a Prismic document
   *
   * @public
   * @async
   * @param {Object} options
   * @param {Object} options.token - Preview token to use
   * @param {Function} [options.linkResolver=this.config.linkResolver] - Prismic Link Resolver to use
   * @throws {Error} - Prismic error
   * @returns {Object} - An escaped Prismic document
   */
  async getPreviewResolver ({ token, documentId, linkResolver = this.config.linkResolver }) {
    const { logger } = this.config
    try {
      const preview = await this.prismic.api.getPreviewResolver(token, documentId)
      return preview.resolve((page) => (page), '/')
    } catch (error) {
      logger.error('PrismicLoader.previewSession error', error)
      throw error
    }
  }
}

export default PrismicLoader
