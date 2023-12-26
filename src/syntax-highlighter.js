import { toHtml } from 'hast-util-to-html';
import { createStarryNight, common } from '@wooorm/starry-night';
import { starryNightGutter } from './hast-util-starry-night-gutter.js';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	const replacements = {
		'&gt;': '>',
		'&lt;': '<',
		'&amp;': '&',
		'#91;': '[',
		'#93;': ']',
	};

	code = code.replace(
		/&gt;|&lt;|&amp;|#91;|#93;/g,
		(match) => replacements[match]
	);

	if (lang === 'php' && !code.startsWith('<?php')) {
		code = `<?php\n${code}`;
	}

	const starryNight = await createStarryNight(common);
	const tree = starryNight.highlight(code, starryNight.flagToScope(lang));

	starryNightGutter(tree);

	return toHtml(tree);
}
