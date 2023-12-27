import { getHighlighter, loadTheme } from 'shiki';
import * as fs from 'fs/promises';
import { join as pathJoin } from 'path';
//
// Shiki loads languages and themes using "fs" instead of "import", so Next.js
// doesn't bundle them into production build. To work around, we manually copy
// them over to our source code (lib/shiki/*) and update the "paths".
//
// Note that they are only referenced on server side
// See: https://github.com/shikijs/shiki/issues/138
const getShikiPath = () => {
	return pathJoin(process.cwd(), 'assets/shiki');
};

const touched = { current: false };

// "Touch" the shiki assets so that Vercel will include them in the production
// bundle. This is required because shiki itself dynamically access these files,
// so Vercel doesn't know about them by default
const touchShikiPath = () => {
	if (touched.current) return; // only need to do once
	fs.readdir(getShikiPath()); // fire and forget
	touched.current = true;
};

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	code = code.replace(/&gt;/g, '>');
	code = code.replace(/&lt;/g, '<');
	code = code.replace(/&amp;/g, '&');
	code = code.replace(/&#91;/g, '[');
	code = code.replace(/&#93;/g, ']');

	touchShikiPath();

	const highlighter = await getHighlighter({
		theme: 'one-dark-pro',
		paths: {
			languages: `${getShikiPath()}/languages/`,
			themes: `${getShikiPath()}/themes/`,
		},
	});

	const focusLines = [];
	const addLines = [];
	const removeLines = [];

	const lines = code.split('\n').map((line, i) => {
		if (!line.includes('[hl ')) {
			return line;
		}

		const highlightProps = line.match(/\[hl (.*)\]/)[1];

		if (highlightProps.includes('--')) {
			removeLines.push(i);
		}

		if (highlightProps.includes('++')) {
			addLines.push(i);
		}

		if (highlightProps.includes('focus')) {
			focusLines.push(i);
		}

		return line.replace(/\[hl (.*)\]/, '').trimEnd();
	});

	let html = highlighter.codeToHtml(lines.join('\n'), lang);

	html = html.split('\n').map((line, i) => {
		if (focusLines.includes(i)) {
			line = line.replace(
				'<span class="line',
				'<span class="line posty-line--focus'
			);
		}

		if (addLines.includes(i)) {
			line = line.replace(
				'<span class="line',
				'<span class="line posty-line--add'
			);
		}

		if (removeLines.includes(i)) {
			line = line.replace(
				'<span class="line',
				'<span class="line posty-line--remove'
			);
		}

		return line;
	});

	console.log(html);

	return html.join('\n');
}
