import Groq from "groq-sdk";
import { injectable } from "inversify";
import type { IAiChatUseCase } from "../interface/ai.chat.interface";

const SYSTEM_PROMPT = `You are an AI assistant inside a project management tool called Sprintly.

Your job is to help beginners understand:
- Project: A collection of work organized around a specific goal or product.
- Sprint: A fixed time-box (usually 1-4 weeks) where a team works on selected user stories.
- User Story: A short description of a feature written from the end-user's perspective.
- Subtask: A small, specific piece of work that makes up a user story.

Rules:
- Keep answers simple and beginner-friendly.
- Limit your response to 100 words maximum.
- Do not answer questions unrelated to project management.
- If asked something off-topic, politely redirect the user to project management topics.`;

@injectable()
export class AiChatUseCase implements IAiChatUseCase {
	private readonly _groq: Groq;

	constructor() {
		this._groq = new Groq({
			apiKey: process.env.GROQ_API_KEY,
		});
	}

	async execute(userMessage: string): Promise<string> {
		const completion = await this._groq.chat.completions.create({
			model: "llama-3.3-70b-versatile",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: userMessage },
			],
			max_tokens: 200,
			temperature: 0.7,
		});

		const reply = completion.choices[0]?.message?.content;

		if (!reply) {
			throw new Error("No response from Groq AI service");
		}

		return reply.trim();
	}
}
