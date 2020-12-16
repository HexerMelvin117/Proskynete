import { promises as fs } from 'fs';
import prettier from 'prettier';

import { PLACEHOLDERS, URLS } from './constants';
import {
  getVersion,
  getLatestArticles,
  sliceArticles,
  getInstagramImages,
  latestInstagramImages
} from "./functions";


(async () => {
  try {
    const prettierConfig = await prettier.resolveConfig('../.pretierrc');

    const [template, articles, images] = await Promise.all([
      fs.readFile("./src/README.md.tpl", { encoding: "utf-8" }),
      getLatestArticles(),
      getInstagramImages()
    ]);
 
    const _verticalTimeline = await getVersion(URLS.VERTICAL_TIMELINE);
    const _prettyRating = await getVersion(URLS.PRETTY_RATING);
    const _articles = articles ? sliceArticles(articles) : '';
    const _images = images ? latestInstagramImages(images) : '';

    const newMarkdown = template
      .replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
      .replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
      .replace(PLACEHOLDERS.WEBSITE.RSS, _articles)
      .replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM, _images);
    
    const markdownFormated = prettier.format(newMarkdown, {
      ...prettierConfig,
      parser: 'mdx',
    });

    await fs.writeFile("./README.md", markdownFormated);
  } catch (error) {
    console.error(error);
  }
})();
