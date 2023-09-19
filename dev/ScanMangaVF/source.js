(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeColor = void 0;
var BadgeColor;
(function (BadgeColor) {
    BadgeColor["BLUE"] = "default";
    BadgeColor["GREEN"] = "success";
    BadgeColor["GREY"] = "info";
    BadgeColor["YELLOW"] = "warning";
    BadgeColor["RED"] = "danger";
})(BadgeColor = exports.BadgeColor || (exports.BadgeColor = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],5:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
/**
* @deprecated Use {@link PaperbackExtensionBase}
*/
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = exports.SourceIntents = void 0;
var SourceIntents;
(function (SourceIntents) {
    SourceIntents[SourceIntents["MANGA_CHAPTERS"] = 1] = "MANGA_CHAPTERS";
    SourceIntents[SourceIntents["MANGA_TRACKING"] = 2] = "MANGA_TRACKING";
    SourceIntents[SourceIntents["HOMEPAGE_SECTIONS"] = 4] = "HOMEPAGE_SECTIONS";
    SourceIntents[SourceIntents["COLLECTION_MANAGEMENT"] = 8] = "COLLECTION_MANAGEMENT";
    SourceIntents[SourceIntents["CLOUDFLARE_BYPASS_REQUIRED"] = 16] = "CLOUDFLARE_BYPASS_REQUIRED";
    SourceIntents[SourceIntents["SETTINGS_UI"] = 32] = "SETTINGS_UI";
})(SourceIntents = exports.SourceIntents || (exports.SourceIntents = {}));
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],7:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./ByteArray"), exports);
__exportStar(require("./Badge"), exports);
__exportStar(require("./interfaces"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./HomeSectionType"), exports);
__exportStar(require("./PaperbackExtensionBase"), exports);

},{"./Badge":1,"./ByteArray":2,"./HomeSectionType":3,"./PaperbackExtensionBase":4,"./Source":5,"./SourceInfo":6,"./interfaces":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],15:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./ChapterProviding"), exports);
__exportStar(require("./CloudflareBypassRequestProviding"), exports);
__exportStar(require("./HomePageSectionsProviding"), exports);
__exportStar(require("./MangaProgressProviding"), exports);
__exportStar(require("./MangaProviding"), exports);
__exportStar(require("./RequestManagerProviding"), exports);
__exportStar(require("./SearchResultsProviding"), exports);

},{"./ChapterProviding":8,"./CloudflareBypassRequestProviding":9,"./HomePageSectionsProviding":10,"./MangaProgressProviding":11,"./MangaProviding":12,"./RequestManagerProviding":13,"./SearchResultsProviding":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],59:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],60:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DynamicUI/Exports/DUIBinding"), exports);
__exportStar(require("./DynamicUI/Exports/DUIForm"), exports);
__exportStar(require("./DynamicUI/Exports/DUIFormRow"), exports);
__exportStar(require("./DynamicUI/Exports/DUISection"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIHeader"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUILink"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIMultilineLabel"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUINavigationButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIOAuthButton"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISecureInputField"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISelect"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUIStepper"), exports);
__exportStar(require("./DynamicUI/Rows/Exports/DUISwitch"), exports);
__exportStar(require("./Exports/ChapterDetails"), exports);
__exportStar(require("./Exports/Chapter"), exports);
__exportStar(require("./Exports/Cookie"), exports);
__exportStar(require("./Exports/HomeSection"), exports);
__exportStar(require("./Exports/IconText"), exports);
__exportStar(require("./Exports/MangaInfo"), exports);
__exportStar(require("./Exports/MangaProgress"), exports);
__exportStar(require("./Exports/PartialSourceManga"), exports);
__exportStar(require("./Exports/MangaUpdates"), exports);
__exportStar(require("./Exports/PBCanvas"), exports);
__exportStar(require("./Exports/PBImage"), exports);
__exportStar(require("./Exports/PagedResults"), exports);
__exportStar(require("./Exports/RawData"), exports);
__exportStar(require("./Exports/Request"), exports);
__exportStar(require("./Exports/SourceInterceptor"), exports);
__exportStar(require("./Exports/RequestManager"), exports);
__exportStar(require("./Exports/Response"), exports);
__exportStar(require("./Exports/SearchField"), exports);
__exportStar(require("./Exports/SearchRequest"), exports);
__exportStar(require("./Exports/SourceCookieStore"), exports);
__exportStar(require("./Exports/SourceManga"), exports);
__exportStar(require("./Exports/SecureStateManager"), exports);
__exportStar(require("./Exports/SourceStateManager"), exports);
__exportStar(require("./Exports/Tag"), exports);
__exportStar(require("./Exports/TagSection"), exports);
__exportStar(require("./Exports/TrackedMangaChapterReadAction"), exports);
__exportStar(require("./Exports/TrackerActionQueue"), exports);

},{"./DynamicUI/Exports/DUIBinding":17,"./DynamicUI/Exports/DUIForm":18,"./DynamicUI/Exports/DUIFormRow":19,"./DynamicUI/Exports/DUISection":20,"./DynamicUI/Rows/Exports/DUIButton":21,"./DynamicUI/Rows/Exports/DUIHeader":22,"./DynamicUI/Rows/Exports/DUIInputField":23,"./DynamicUI/Rows/Exports/DUILabel":24,"./DynamicUI/Rows/Exports/DUILink":25,"./DynamicUI/Rows/Exports/DUIMultilineLabel":26,"./DynamicUI/Rows/Exports/DUINavigationButton":27,"./DynamicUI/Rows/Exports/DUIOAuthButton":28,"./DynamicUI/Rows/Exports/DUISecureInputField":29,"./DynamicUI/Rows/Exports/DUISelect":30,"./DynamicUI/Rows/Exports/DUIStepper":31,"./DynamicUI/Rows/Exports/DUISwitch":32,"./Exports/Chapter":33,"./Exports/ChapterDetails":34,"./Exports/Cookie":35,"./Exports/HomeSection":36,"./Exports/IconText":37,"./Exports/MangaInfo":38,"./Exports/MangaProgress":39,"./Exports/MangaUpdates":40,"./Exports/PBCanvas":41,"./Exports/PBImage":42,"./Exports/PagedResults":43,"./Exports/PartialSourceManga":44,"./Exports/RawData":45,"./Exports/Request":46,"./Exports/RequestManager":47,"./Exports/Response":48,"./Exports/SearchField":49,"./Exports/SearchRequest":50,"./Exports/SecureStateManager":51,"./Exports/SourceCookieStore":52,"./Exports/SourceInterceptor":53,"./Exports/SourceManga":54,"./Exports/SourceStateManager":55,"./Exports/Tag":56,"./Exports/TagSection":57,"./Exports/TrackedMangaChapterReadAction":58,"./Exports/TrackerActionQueue":59}],61:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./generated/_exports"), exports);
__exportStar(require("./base/index"), exports);
__exportStar(require("./compat/DyamicUI"), exports);

},{"./base/index":7,"./compat/DyamicUI":16,"./generated/_exports":60}],62:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanMangaVF = exports.ScanMangaVFInfo = void 0;
const types_1 = require("@paperback/types");
const ScanMangaVFParser_1 = require("./ScanMangaVFParser");
exports.ScanMangaVFInfo = {
    version: "1.0.0",
    name: "ScanMangaVF",
    icon: "navalex.png",
    author: "Navalex",
    authorWebsite: "https://github.com/navalex",
    description: "Extension to use scanmanga-vf french website",
    contentRating: types_1.ContentRating.EVERYONE,
    websiteBaseURL: ScanMangaVFParser_1.DOMAIN,
    sourceTags: [
        {
            text: "Fench",
            type: types_1.BadgeColor.BLUE,
        },
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED,
};
class ScanMangaVF {
    constructor(cheerio) {
        this.cheerio = cheerio;
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 300000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            "user-agent": await this.requestManager.getDefaultUserAgent(),
                            referer: `${ScanMangaVFParser_1.DOMAIN}/`,
                        },
                    };
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                },
            },
        });
    }
    getMangaShareUrl(mangaId) {
        return `${ScanMangaVFParser_1.DOMAIN}/manga/${mangaId}`;
    }
    async getSearchTags() {
        const request = App.createRequest({
            url: `${ScanMangaVFParser_1.DOMAIN}/manga-list`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const tags = (0, ScanMangaVFParser_1.getTags)($);
        return [
            App.createTagSection({
                id: "genres",
                label: "Genres",
                tags: tags ?? [],
            }),
        ];
    }
    async getHomePageSections(sectionCallback) {
        const section1 = App.createHomeSection({
            id: "latest_popular_manga",
            title: "Dernier Manga Populaire",
            containsMoreItems: false,
            type: types_1.HomeSectionType.featured,
        });
        const section2 = App.createHomeSection({
            id: "latest_updates",
            title: "Derniers Manga Ajoutés",
            containsMoreItems: false,
            type: types_1.HomeSectionType.singleRowLarge,
        });
        const request = App.createRequest({
            url: `${ScanMangaVFParser_1.DOMAIN}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        section1.items = (0, ScanMangaVFParser_1.getHomePagePopular)($);
        section2.items = (0, ScanMangaVFParser_1.getHomePageLatest)($);
        sectionCallback(section1);
        sectionCallback(section2);
    }
    async getViewMoreItems(_homepageSectionId, _metadata) {
        throw new Error("Requested to getViewMoreItems for a section ID which doesn't exist");
    }
    async getMangaDetails(mangaId) {
        const request = App.createRequest({
            url: `${ScanMangaVFParser_1.DOMAIN}/manga/${mangaId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, ScanMangaVFParser_1.getMangaDetails)($, mangaId);
    }
    async getChapters(mangaId) {
        const request = App.createRequest({
            url: `${ScanMangaVFParser_1.DOMAIN}/manga/${mangaId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, ScanMangaVFParser_1.getChapters)($);
    }
    async getChapterDetails(mangaId, chapterId) {
        const request = App.createRequest({
            url: `${chapterId}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const pages = (0, ScanMangaVFParser_1.getChapterPages)($);
        return App.createChapterDetails({
            id: chapterId,
            mangaId: mangaId,
            pages: pages,
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    async getSearchResults(query, metadata) {
        const searchPage = metadata?.page ?? 1;
        const search = query.title?.replace(/ /g, "+").replace(/[’'´]/g, "%27") ?? "";
        const param = `filterList?page=${searchPage}&tag=&alpha=${search}&sortBy=name&asc=true`;
        const request = App.createRequest({
            url: `${ScanMangaVFParser_1.DOMAIN}/${param}`,
            method: "GET",
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const albums = (0, ScanMangaVFParser_1.getSearchResults)($);
        return App.createPagedResults({
            results: albums,
            metadata,
        });
    }
    CloudFlareError(status) {
        if (status == 503 || status == 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${exports.ScanMangaVFInfo.name}> and press the cloud icon.`);
        }
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: ScanMangaVFParser_1.DOMAIN,
            method: "GET",
            headers: {
                referer: `${ScanMangaVFParser_1.DOMAIN}/`,
                "user-agent": await this.requestManager.getDefaultUserAgent(),
            },
        });
    }
}
exports.ScanMangaVF = ScanMangaVF;

},{"./ScanMangaVFParser":63,"@paperback/types":61}],63:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchResults = exports.getChapterPages = exports.getChapters = exports.getMangaDetails = exports.getHomePageLatest = exports.getHomePagePopular = exports.getTags = exports.DOMAIN = void 0;
exports.DOMAIN = "https://scanmanga-vf.me";
function getTags($) {
    const arrayTags = [];
    for (let item of $(".list-category a").toArray()) {
        let id = ($(item).attr("href") ?? "").split("/").pop() ?? "";
        let label = capitalizeFirstLetter(decodeHTMLEntity($(item).text()));
        arrayTags.push(App.createTag({ id, label }));
    }
    return arrayTags;
}
exports.getTags = getTags;
function getHomePagePopular($) {
    const items = [];
    const list = $(".hot-thumbnails li").toArray();
    console.log("Looking for Popular", list);
    for (const item of list) {
        let url = $("a", item).first().attr("href")?.split("/")[4];
        let image = $("img", item).attr("src");
        let title = decodeHTMLEntity($(".manga-name a", item).first().text());
        let subtitle = decodeHTMLEntity($("p", item).text().trim());
        if (typeof url === "undefined" || typeof image === "undefined")
            continue;
        items.push(App.createPartialSourceManga({
            mangaId: url,
            image: image,
            title: title,
            subtitle: subtitle,
        }));
    }
    return items;
}
exports.getHomePagePopular = getHomePagePopular;
function getHomePageLatest($) {
    const items = [];
    const list = $(".mangalist .manga-item").toArray();
    for (const item of list) {
        let url = $("a", item).first().attr("href")?.split("/").pop();
        let image = getMangaThumbnail(url);
        let title = decodeHTMLEntity($("a", item).first().text());
        let subtitle = "Chapitre " +
            decodeHTMLEntity(($("a", item)
                .eq(1)
                .text()
                .trim()
                .match(/(\d)+[.]?(\d)*/gm) ?? "")[0]);
        if (typeof url === "undefined" || typeof image === "undefined")
            continue;
        items.push(App.createPartialSourceManga({
            mangaId: url,
            image: image,
            title: title,
            subtitle: subtitle,
        }));
    }
    return items;
}
exports.getHomePageLatest = getHomePageLatest;
function getMangaDetails($, mangaId) {
    let titles = [decodeHTMLEntity($(".widget-title").eq(0).text().trim())];
    const image = $(".img-responsive").attr("src") || "";
    let status = "Unknown", author = "", artist = "";
    // Details container
    const panel = $(".dl-horizontal");
    // Status
    switch ($('dt:contains("Statut")', panel).next().text().trim()) {
        case "En cours":
            status = "Ongoing";
            break;
        case "Terminé":
            status = "Completed";
            break;
    }
    // Other titles
    let othersTitles = $('dt:contains("Appel\u00E9 aussi")', panel).next().text().trim().split(",");
    for (let title of othersTitles) {
        titles.push(decodeHTMLEntity(title.trim()));
    }
    // Author & Artist
    const arrayTags = [];
    author =
        $('dt:contains("Auteur(s)")', panel).next().text().trim() != ""
            ? $('dt:contains("Auteur(s)")', panel).next().text().trim()
            : "";
    artist =
        $('dt:contains("Artist(s)")', panel).next().text().trim() != ""
            ? $('dt:contains("Artist(s)")', panel).next().text().trim()
            : "";
    // Set tags
    if ($('dt:contains("Catégories")', panel).length > 0) {
        const categories = $('dt:contains("Catgories")', panel).next().text().trim().split(",") ?? "";
        for (const category of categories) {
            const label = capitalizeFirstLetter(decodeHTMLEntity(category.trim()));
            const id = category.replace(" ", "-").toLowerCase().trim() ?? label;
            arrayTags.push({ id: id, label: label });
        }
    }
    // Tags
    if ($('dt:contains("Genres")', panel).length > 0) {
        const tags = $('dt:contains("Genres")', panel).next().text().trim().split(",");
        for (const tag of tags) {
            const label = tag.replace(/(\r\n|\n|\r)/gm, "").trim();
            const id = tag
                .replace(/(\r\n|\n|\r)/gm, "")
                .trim()
                .replace(" ", "-")
                .toLowerCase() ?? label;
            if (!arrayTags.includes({ id: id, label: label })) {
                arrayTags.push({ id: id, label: label });
            }
        }
    }
    const tagSections = [
        App.createTagSection({ id: "0", label: "Genres", tags: arrayTags.map((x) => App.createTag(x)) }),
    ];
    const desc = decodeHTMLEntity($(".well").children("p").text().trim());
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles,
            image,
            status,
            artist,
            author,
            tags: tagSections,
            desc: desc,
        }),
    });
}
exports.getMangaDetails = getMangaDetails;
function getChapters($) {
    const chapters = [];
    const arrChapters = $(".chapters li:not(.volume)").toArray();
    for (const chapter of arrChapters) {
        const id = $("a", chapter).attr("href") ?? "";
        const name = "Chapitre " + decodeHTMLEntity($("a", chapter).text().split(" ").pop() ?? "");
        const chapNum = Number(id.split("/").pop());
        const time = new Date($(".date-chapter-title-rtl", chapter).text() ?? "");
        chapters.push(App.createChapter({
            id,
            name,
            langCode: "French",
            chapNum,
            time,
        }));
    }
    return chapters;
}
exports.getChapters = getChapters;
function getChapterPages($) {
    const pages = [];
    const chapterList = $("#all img").toArray();
    for (const obj of chapterList) {
        const imageUrl = $(obj).attr("data-src");
        if (!imageUrl)
            continue;
        pages.push(imageUrl.trim());
    }
    return pages;
}
exports.getChapterPages = getChapterPages;
function getSearchResults($) {
    const results = [];
    for (const item of $(".media").toArray()) {
        const url = $("h5 a", item).attr("href")?.split("/")[4];
        const image = $("img", item).attr("src");
        const title = decodeHTMLEntity($("h5", item).text());
        const subtitle = "Chapitre " + decodeHTMLEntity($("a", item).eq(2).text().trim().replace(/#/g, ""));
        if (typeof url === "undefined" || typeof image === "undefined")
            continue;
        results.push(App.createPartialSourceManga({
            mangaId: url,
            image: image,
            title: title,
            subtitle: subtitle,
        }));
    }
    return results;
}
exports.getSearchResults = getSearchResults;
function decodeHTMLEntity(str) {
    return str.replace(/&#(\d+);/g, function (_match, dec) {
        return String.fromCharCode(dec);
    });
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function getMangaThumbnail(mangaID) {
    return `${exports.DOMAIN}/uploads/manga/${mangaID}.jpg`;
}

},{}]},{},[62])(62)
});
