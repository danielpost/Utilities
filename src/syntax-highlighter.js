import { toHtml } from 'hast-util-to-html';
import { createStarryNight, common } from '@wooorm/starry-night';
import { starryNightGutter } from './hast-util-starry-night-gutter.js';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	if (lang === 'php' && !code.startsWith('<?php')) {
		code = `<?php\n${code}`;
	}

	code = `function blur() {
	const isBlurred = true;//[hl ++]
	console.log(isBlurred);//[hl --]
	console.log({ isBlurred });//[hl focus]
}

blur();`;

	lang = 'js';

	const starryNight = await createStarryNight(common);
	const tree = starryNight.highlight(code, starryNight.flagToScope(lang));

	starryNightGutter(tree);

	return toHtml(tree);
}
