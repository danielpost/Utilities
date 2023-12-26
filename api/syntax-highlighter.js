import { highlight } from '../src/syntax-highlighter.js';

export default async (request, response) => {
	if (!request.body || !request.body.code || !request.body.lang) {
		return response.status(400).json({
			error: 'Missing code or lang',
		});
	}

	response.status(200).json({
		html: await highlight(request.body.code, request.body.lang),
	});
};
