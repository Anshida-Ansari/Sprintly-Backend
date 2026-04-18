import Groq from "groq-sdk";
import { inject, injectable } from "inversify";
import type { IAiChatUseCase } from "../interface/ai.chat.interface";
import { AI_TYPES } from "@infrastructure/di/types/ai/ai.types";
import type { IAiDataAggregator } from "../interface/ai.data-aggregator.interface";

const SYSTEM_PROMPT = `You are an AI assistant integrated into a Project Management Tool.

Your role is NOT to explain general concepts. Your role is to help users by analyzing real-time project data such as tasks, subtasks, sprints, and user activity.

You must:
* Understand user intent (standup, task query, sprint summary, blockers, etc.)
* Use the provided data to generate accurate, concise responses
* Always prioritize data over assumptions
* If data is missing, clearly say "No data available"

Response Rules:
* Keep responses structured and clean
* Use bullet points where needed
* Do not hallucinate data
* Do not explain generic definitions unless explicitly asked`;

@injectable()
export class AiChatUseCase implements IAiChatUseCase {
	private readonly _groq: Groq;

	constructor(
		@inject(AI_TYPES.IAiDataAggregator)
		private readonly _aiDataAggregator: IAiDataAggregator,
	) {
		this._groq = new Groq({
			apiKey: process.env.GROQ_API_KEY,
		});
	}

	async execute(userMessage: string, context?: { companyId?: string; projectId?: string; userId?: string }): Promise<string> {
		console.log("[AiChatUseCase] Executing with context:", context);
		let projectContext = null;
		if (context?.companyId) {
			projectContext = await this._aiDataAggregator.getProjectContext(context.companyId, context.projectId, context.userId);
			console.log("[AiChatUseCase] Fetched projectContext projectInfo:", !!projectContext?.projectInfo);
		}

		let prompt = userMessage;
		const query = userMessage.toLowerCase();

		// Add project background if available
		const projectBackground = projectContext?.projectInfo 
			? `CURRENT PROJECT CONTEXT:
Project Name: ${projectContext.projectInfo.name}
Description: ${projectContext.projectInfo.description}
Status: ${projectContext.projectInfo.status}
`
			: "";

		if (query.includes("standup")) {
			prompt = `Generate a daily standup update using the following data:

Completed Tasks (Yesterday):
${projectContext?.completedTasksYesterday.map(t => `- ${t.title}`).join("\n") || "No data available"}

In Progress Tasks (Today):
${projectContext?.inProgressTasksToday.map(t => `- ${t.title}`).join("\n") || "No data available"}

Blocked Tasks:
${projectContext?.blockedTasks.map(t => `- ${t.title}`).join("\n") || "No data available"}

Format:
* Yesterday:
* Today:
* Blockers:

Keep it short, clear, and professional.
User Query: "${userMessage}"`;
		} else if (query.includes("summary") || query.includes("progress")) {
			const completionRate = projectContext ? Math.round((projectContext.completedTasksCount / (projectContext.totalTasksCount || 1)) * 100) : 0;
			const status = completionRate > 70 ? "Good" : completionRate > 40 ? "Moderate" : "At Risk";

			prompt = `Generate a sprint summary using the following data:

Total Tasks: ${projectContext?.totalTasksCount || 0}
Completed Tasks: ${projectContext?.completedTasksCount || 0}
Pending Tasks: ${projectContext?.pendingTasksCount || 0}
Blocked Tasks: ${projectContext?.blockedTasksCount || 0}

Provide:
* Completion %: ${completionRate}%
* Overall progress status: ${status}
* Key insights (1–2 lines)

Keep it concise and professional.
User Query: "${userMessage}"`;
		} else if (query.includes("task") || query.includes("fetch") || query.includes("find")) {
			prompt = `User Query: "${userMessage}"

Here is the task data:
${projectContext?.inProgressTasksToday.concat(projectContext?.blockedTasks).map(t => `- ${t.title} [Status: ${t.status}, Priority: ${t.priority || "Normal"}, Due: ${t.dueDate || "N/A"}]`).join("\n") || "No tasks found"}

Based on the query, filter and return only relevant tasks.

Response format:
* Task Name
* Status
* Priority
* Due Date (if available)

If no tasks match, say "No tasks found".`;
		}

		const completion = await this._groq.chat.completions.create({
			model: "llama-3.3-70b-versatile",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: projectBackground + prompt },
			],
			max_tokens: 500,
			temperature: 0.5,
		});

		const reply = completion.choices[0]?.message?.content;

		if (!reply) {
			throw new Error("No response from Groq AI service");
		}

		return reply.trim();
	}
}
