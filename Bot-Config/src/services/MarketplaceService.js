import config from '@/services/config.js'

const URL = `http://${config.server}:4000/api/v1/discover/`

/**
 * A template.
 *
 * @typedef {Object} Template
 * @property {string} name - The template's name
 * @property {LocalizedTemplate} en
 * @property {LocalizedTemplate} de
 * @property {LocalizedTemplate} fr
 */

/**
 * A localized template.
 *
 * @typedef {Object} LocalizedTemplate
 * @property {string} message - The template's impression message
 * @property {string} description - The template's textual description
 */

/**
 * The Marketplace service.
 * Provides functionality for accessing the marketplace.
 *
 * @author Marcel Herd
 * @module services/MarketplaceService
 */
export default {
  /**
   * Returns a promise containing the available templates.
   *
   * @method getTemplates
   * @return {Promise.<Template[]>} - a promise containing the available templates
   */
  getTemplates () {
    return fetch(URL).then(response => response.json())
  }
}
