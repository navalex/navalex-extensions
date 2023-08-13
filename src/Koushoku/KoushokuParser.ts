import {
    PartialSourceManga,
    RequestManager,
    Tag,
    TagSection
} from '@paperback/types';

import entities = require('entities');

export const DOMAIN = 'https://ksk.moe';
const REGEX_PAGE = /[0-9]+(.(jpg|png))/g;

export async function getTags(requestManager: RequestManager, cheerio: CheerioAPI): Promise<Tag[]> {
    const request = App.createRequest({
        url: `${DOMAIN}/tags/page/1`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const tagElements = $('main', 'main').children().toArray();

    const request2 = App.createRequest({
        url: `${DOMAIN}/tags/page/2`,
        method: 'GET'
    });
    const data2 = await requestManager.schedule(request2, 1);
    const $$ = cheerio.load(data2.data as string);
    const tagElements2 = $$('main', 'main').children().toArray();
    
    const tags: Tag[] = [];

    for (const element of tagElements) {
        const id = $('a', element).attr('href') ?? '';
        const label = $('span', element).first().text() ?? '';
        tags.push(App.createTag({ id, label }));
    }

    for (const element of tagElements2) {
        const id = $$('a', element).attr('href') ?? '';
        const label = $$('span', element).first().text() ?? '';
        tags.push(App.createTag({ id, label }));
    }

    return tags;
}

export function getAlbums ($: CheerioStatic): PartialSourceManga[] {
    const albums: PartialSourceManga[] = [];
    const albumGroups = $('article', 'main').toArray();
 
    for (const album of albumGroups) {
        const image = $('img', album).attr('src') ?? '';
        const id = $('a', album).attr('href') ?? '';
        const title = $('a', album).attr('title') ?? '';
        const artist = $('span', album).first().text() ?? '';

        if (!id || !title) {
            continue;
        }

        albums.push(App.createPartialSourceManga({
            mangaId: encodeURIComponent(id),
            image: image ? image : 'https://i.imgur.com/GYUxEX8.png',
            subtitle: artist,
            title: entities.decodeHTML(title)
        }));
    }

    return albums;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getGalleryData(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<any> {
    const request = App.createRequest({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);

    const title = $('h2', 'section#metadata').first().text();
    const image = $('img').first().attr('src') ?? 'https://i.imgur.com/GYUxEX8.png';
    const artistSection = $('strong:contains("Artist")').parent();
    const artist = $('span', artistSection).first().text();

    const tagsElement1 = $('strong:contains("Tag")').first().parent();
    const tagsElement2 = $('span', tagsElement1).toArray();

    const tagsToRender: Tag[] = [];
    for (const tag of tagsElement2) {
        const label = $(tag).text();
        if (label.match(/^\d/)) continue;
        
        if (!label) {
            continue;
        }
        tagsToRender.push({ id: `/tags/${encodeURIComponent(label)}`, label: label });
    }

    const tagSections: TagSection[] = [App.createTagSection({
        id: '0',
        label: 'Tags',
        tags: tagsToRender.map(x => App.createTag(x)) 
    })];

    return {
        id: id,
        titles: [entities.decodeHTML(title as string)],
        image: image,
        artist: artist,
        tags: tagSections
    };
}

export async function getPages(id: string, requestManager: RequestManager, cheerio: CheerioAPI): Promise<string[]> {
    const imageId = id.slice(10);
    const pages: string[] = [];
    
    // Determine page length
    const request = App.createRequest({
        url: `${DOMAIN}/${id}`,
        method: 'GET'
    });
    const data = await requestManager.schedule(request, 1);
    const $ = cheerio.load(data.data as string);
    const length = parseInt($('span:contains("Pages")').text().split(' ')[0] ?? '');
    const urlPieces = $('img').first().attr('src')?.split('/') ?? '';
    const suffix = urlPieces[urlPieces?.length - 1] ?? '';

    const pagesRequest = App.createRequest({
        url: `${DOMAIN}/read${id.slice(7)}/1`,
        method: 'GET'
    });
    const pagesData = await requestManager.schedule(pagesRequest, 1);
    const $$ = cheerio.load(pagesData.data as string, {xmlMode: true});

    // Image format is not guranteed
    // const imageFormat = suffix.slice(suffix.length, 3) ? 'jpg' : 'png';
    const pageNumFormat = suffix.split('.')[0]?.length;

    // Extract page nums from script
    const pageNums = $$('script[type$=javascript]').last().toString();
    const unsortedPageNumsList = pageNums.matchAll(REGEX_PAGE);
    const pageNumsList = [...new Set(Array.from(unsortedPageNumsList, x => x[0]))];

    if (pageNumFormat === 2 || pageNumFormat === 3) {
        for (let i = 0; i < length; i++) {
            const imageLink = `${DOMAIN}/resampled/${imageId}/${pageNumsList[i]}`;
            pages.push(imageLink);
        }
    } else {
        const urlFormat = urlPieces[urlPieces.length - 1];
        const firstHalf = urlFormat?.split('001')[0] ?? '';
        const lastHalf = urlFormat?.split('001')[1] ?? '';

        for (let i = 1; i < length + 1; i++) {
            // Pages start from 001, 002..010, 011..100, 101...
            let pageNumFormat = i < 10 ? `00${i}` : `0${i}`;
            if (i > 99) {
                pageNumFormat = `${i}`;
            }
            const finalFormat = firstHalf?.concat(pageNumFormat, lastHalf);
            const imageLink = `${DOMAIN}/resampled/${imageId}/${finalFormat}`;
            pages.push(imageLink);
        }
    }

    return pages;
}

export const isLastPage = (albums: PartialSourceManga[]): boolean => {
    // max albums displayed per page, need to find better way - last page will have 35 albums for popular sections
    return albums.length != 35; 
};  

export async function testImageLink(imageLink: string, requestManager: RequestManager): Promise<string> {
    const jpgImageLink = imageLink.replace(/.{0,3}$/, '') + 'jpg';
    
    const request = App.createRequest({
        url: imageLink,
        method: 'GET'
    });

    const status = (await requestManager.schedule(request, 1)).status;
    if (status !== 200) {
        return jpgImageLink;
    }

    return imageLink;
}