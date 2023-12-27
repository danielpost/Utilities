import { getHighlighter } from 'shiki';

export async function highlight(code, lang) {
	if (!code || !lang) {
		return '';
	}

	code = code.replace(/&gt;/g, '>');
	code = code.replace(/&lt;/g, '<');
	code = code.replace(/&amp;/g, '&');
	code = code.replace(/&#91;/g, '[');
	code = code.replace(/&#93;/g, ']');

	const highlighter = await getHighlighter({
		theme: 'one-dark-pro',
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
