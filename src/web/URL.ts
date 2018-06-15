/**
 * @author
 * @license MIT
 */
import * as http from 'http';

import Request from './Request';
import StringHelper from '../helpers/StringHelper';

/**
 * Uniform Resource Location
 *
 * @see https://tools.ietf.org/html/rfc1738
 */
export default class URL {

    /**
     * 创建一个 url
     *
     * eg.
     *
     * // scheme://host/index/index
     * url.to('index/index')
     *
     * // scheme://host/index/index?id=1#anchor
     * url.to('index/index', {id: 1, '#': 'anchor'})
     *
     * @param {String} url
     * @param {Object} params
     * @return {String}
     */
    public static to(request: http.ServerRequest, url: string, params: any = null): string {
        let host = new Request(request).getHostInfo();
        let query = '';
        let anchor = '';

        url = host + '/' + url;

        if(null !== params) {
            if(undefined !== params['#']) {
                anchor = params['#'];
                delete params['#'];
            }

            for(let k in params) {
                query = query + k + '=' + params[k] + '&';
            }
            query = StringHelper.rTrimChar(query, '&');

            if('' !== query) {
                url = url + '?' + query;
            }
            if('' !== anchor) {
                url = url + '#' + anchor;
            }
        }

        return url;
    }

}
