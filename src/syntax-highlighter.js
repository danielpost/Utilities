import { toHtml } from 'hast-util-to-html';
import { createStarryNight, common } from '@wooorm/starry-night';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	if (lang === 'php' && !code.startsWith('<?php')) {
		code = `<?php\n${code}`;
	}

	const starryNight = await createStarryNight(common);
	const tree = starryNight.highlight(code, starryNight.flagToScope(lang));
	return toHtml(tree);
}
