import { toHtml } from 'hast-util-to-html';
import { createStarryNight, common } from '@wooorm/starry-night';
import { starryNightGutter } from './hast-util-starry-night-gutter.js';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	code = code.replace(/&gt;/g, '>');
	code = code.replace(/&lt;/g, '<');
	code = code.replace(/&amp;/g, '&');
	code = code.replace(/&#91;/g, '[');
	code = code.replace(/&#93;/g, ']');

	let startsWithPhpTag = false;

	if (lang === 'php' && !code.startsWith('<?php')) {
		code = `<?php\n${code}`;
		startsWithPhpTag = true;
	}

	const starryNight = await createStarryNight(common);
	const tree = starryNight.highlight(code, starryNight.flagToScope(lang));

	if (startsWithPhpTag) {
		tree.children = tree.children.slice(2);
	}

	starryNightGutter(tree);

	return toHtml(tree);
}
