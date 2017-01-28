const mapResolver = require('../index');
const expect = require('chai').expect;


describe('mapResolver', function () {
    var map, resolve;

    it('should throw error if map is not an object', function () {
        expect(() => mapResolver(map)).to.throw('Map must be an object');
    });

    it('should throw error if map is an empty object', function () {
        expect(() => mapResolver({})).to.throw('Map must be a filled object');
    });

    it('should throw error if map is an empty object', function () {
        const req = {
            query: {id: 1}
        };
        expect(() => mapResolver({'@': req.body})).to.throw('Map must be an instance of Object<string, func>');
    });

    it('should throw error if returned object of referencing function is neither `object`, `array` or `undefined`', function () {
        const req = {
            body: 'str'
        };
        expect(() => mapResolver({'@': ()=>req.body})).to.throw('The returned object of reference should only be either `object`, `array` or `undefined`');
    });

    it('should throw error if non-string passed to resolver as a flag', function () {
        const req = {
            body: {}
        };
        resolve = mapResolver({'@': ()=>req.body});
        expect(()=>resolve(1.2)).to.throw('Flag must be a string');
    });


    it('should resolve value properly', function () {
        const req = {
            query: {id: '1'},
            params: ['1', '2'],
            cookies: {session: {id: '=ABC'}, 'session.id': '=CDE'}
        };
        map = {
            '@': () => req.body,
            'URL结尾': () => req.query,
            '?': () => req.params,
            '...': () => req.cookies
        };
        resolve = mapResolver(map);
        expect(resolve('*', 'id')).to.equal(undefined);
        expect(resolve('URL结尾')).to.equal(undefined);
        expect(resolve('URL结尾ID')).to.equal(undefined);
        expect(resolve('URL结尾', 'id')).to.equal('1');
        expect(resolve('URL结尾id')).to.equal('1');
        expect(resolve('@id')).to.equal(undefined);
        expect(resolve('?0')).to.equal('1');
        expect(resolve('...session.id')).to.equal('=ABC');
        expect(resolve('...', 'session.id', false)).to.equal('=CDE');
        expect(resolve('...', 'session.ia.ib.ic.id')).to.equal(undefined);
    });
});