/**
 * @author
 * @license MIT
 */
import * as http from 'http';

/**
 * 一条 HTTP cookie 信息
 *
 * name=value; Expires=expires; Path=path; Domain=domain[; secure][; httponly]
 */
class Cookie {

    public name: string;
    public value: string;
    public expires: number;
    public path: string;
    public domain: string;
    public secure: boolean;
    public httpOnly: boolean;

    /**
     * constructor
     *
     * @param {String} name cookie name
     * @param {String} value cookie value
     * @param {Number} expires cookie expires time in milliseconds
     * @param {String} path cookie path
     * @param {String} domain cookie domain
     * @param {Boolean} secure cookie secure
     * @param {Boolean} httpOnly cookie httpOnly
     */
    constructor(name: string, value: string,
        expires: number = 0, path: string = '/',
        domain: string = '', secure: boolean = false, httpOnly: boolean = false) {
        this.name = name;
        this.value = value;
        this.expires = expires;
        this.path = path;
        this.domain = domain;
        this.secure = secure;
        this.httpOnly = httpOnly;
    }

    public toString(): string {
        let ret: string[] = [this.name + '=' + this.value];

        if(0 !== this.expires) {
            ret.push('Expires=' + new Date(this.expires).toUTCString());
        }
        ret.push('Path=' + this.path);
        if('' !== this.domain) {
            ret.push('Domain=' + this.domain);
        }
        if(this.secure) {
            ret.push('Secure');
        }
        if(this.httpOnly) {
            ret.push('HttpOnly');
        }

        return ret.join('; ');
    }

    /**
     * 获取 cookie
     *
     * @param {http.ServerRequest} request cookie name
     * @param {String} name cookie name
     * @return {String | null}
     */
    public static getCookie(request: http.ServerRequest, name: string): string | null {
        if(undefined === request.headers['cookie']) {
            return null;
        }

        let ret: string = '';
        let tmp: string[] = null;
        let list: string[] = (<string>request.headers['cookie']).split('; ');

        for(let i=0,len=list.length; i<len; i++) {
            tmp = list[i].split('=');

            if(name === tmp[0]) {
                ret = decodeURIComponent(tmp[1]);
                break;
            }
        }

        return ret;
    }

    /**
     * 设置 cookie
     *
     * @param {Object} response cookie name
     * @param {Array} cookies cookies
     */
    public static setCookie(response: http.ServerResponse, cookies: any): void {
        response.setHeader('Set-Cookie', cookies);
    }

}

export = Cookie;
