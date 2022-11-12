import { highlight } from '../src/syntax-highlighter.js';

export default async (request, response) => {
	response.status(200).json({
		html: await highlight(request.query.code, request.query.lang),
	});
};
