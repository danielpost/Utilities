// import { toHtml } from 'hast-util-to-html';
// import { createStarryNight, common } from '@wooorm/starry-night';

import shiki from 'shiki';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	if (lang === 'php' && !code.startsWith('<?php')) {
		code = `<?php\n${code}`;
	}

	const highlighter = await shiki.getHighlighter({
		theme: 'nord',
	});

	return highlighter.codeToHtml(code, { lang });

	// const starryNight = await createStarryNight(common);
	// const tree = starryNight.highlight(code, starryNight.flagToScope(lang));
	// return toHtml(tree);
}
