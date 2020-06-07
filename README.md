<a name="PrismicLoader"></a>

## PrismicLoader
Convenient loader for Prismic

**Kind**: global class  
**Requires**: <code>module:&#x27;prismic-javascript&#x27;</code>  
**Todo**

- [ ] Tests


* [PrismicLoader](#PrismicLoader)
    * [new PrismicLoader(options)](#new_PrismicLoader_new)
    * [.connect([options])](#PrismicLoader+connect) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.fetchAll([options])](#PrismicLoader+fetchAll) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.fetch(options)](#PrismicLoader+fetch) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.fetchAllAsIndexed([options])](#PrismicLoader+fetchAllAsIndexed) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.fetchAsIndexed(options)](#PrismicLoader+fetchAsIndexed) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getPreviewResolver(options)](#PrismicLoader+getPreviewResolver) ⇒ <code>Object</code>

<a name="new_PrismicLoader_new"></a>

### new PrismicLoader(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.accessToken | <code>string</code> |  | The access token used to communicate with the Prismic API (https://user-guides.prismic.io/en/articles/1036153-generating-an-access-token) |
| options.apiEndpoint | <code>string</code> |  | The Prismic API endpoint for your repository (https://prismic.io/docs/rest-api/basics/introduction-to-the-content-query-api#4_1-the-api-search-endpoint) |
| [options.logger] | <code>Object</code> | <code>console</code> | Logger |
| [options.linkResolver] | <code>function</code> |  | Prismic Link Resolver to use |

**Example**  
```js
import PrismicLoader from 'prismic-loader'

const accessToken = 'PRISMIC ACCESS TOKEN'
const apiEndpoint = 'https://repo.cdn.prismic.io/api/v2'
const prismicLoader = new PrismicLoader({ accessToken, apiEndpoint })
```
<a name="PrismicLoader+connect"></a>

### prismicLoader.connect([options]) ⇒ <code>Promise.&lt;Object&gt;</code>
Connect to the Prismic API

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Object containing the connected Prismic API instance  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> |  |
| [options.req] | <code>Object</code> |  | The Request object |

<a name="PrismicLoader+fetchAll"></a>

### prismicLoader.fetchAll([options]) ⇒ <code>Promise.&lt;Array&gt;</code>
Fetch all documents

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - An array of documents from Prismic  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.lang] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | Language to query |
| [options.pageSize] | <code>number</code> | <code>100</code> | Number of documents to fetch at a time |

<a name="PrismicLoader+fetch"></a>

### prismicLoader.fetch(options) ⇒ <code>Promise.&lt;Array&gt;</code>
Fetch matching Prismic documents

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - - Prismic documents  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.query | <code>string</code> | Prismic query |
| options.options | <code>Object</code> | Prismic query options |

<a name="PrismicLoader+fetchAllAsIndexed"></a>

### prismicLoader.fetchAllAsIndexed([options]) ⇒ <code>Promise.&lt;Object&gt;</code>
Fetch all documents as indexed object

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - id indexed Prismic documents  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.lang] | <code>string</code> | <code>&quot;&#x27;*&#x27;&quot;</code> | Language to query |
| [options.pageSize] | <code>number</code> | <code>100</code> | Number of documents to fetch at a time |

<a name="PrismicLoader+fetchAsIndexed"></a>

### prismicLoader.fetchAsIndexed(options) ⇒ <code>Promise.&lt;Object&gt;</code>
Fetch documents as indexed object

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - id indexed Prismic documents  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.query | <code>string</code> | Prismic query |
| options.options | <code>Object</code> | Prismic query options |

<a name="PrismicLoader+getPreviewResolver"></a>

### prismicLoader.getPreviewResolver(options) ⇒ <code>Object</code>
Preview a Prismic document

**Kind**: instance method of [<code>PrismicLoader</code>](#PrismicLoader)  
**Returns**: <code>Object</code> - - An escaped Prismic document  
**Throws**:

- <code>Error</code> - Prismic error

**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.token | <code>Object</code> |  | Preview token to use |
| [options.linkResolver] | <code>function</code> | <code>this.config.linkResolver</code> | Prismic Link Resolver to use |

