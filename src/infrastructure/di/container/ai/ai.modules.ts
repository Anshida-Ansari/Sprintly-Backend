import { ContainerModule } from "inversify";
import { AiChatUseCase } from "../../../../application/usecases/ai/implementation/ai.chat.usecase";
import { AiDataAggregator } from "../../../../application/usecases/ai/implementation/ai.data-aggregator";
import { AiController } from "../../../../presentation/http/controllers/ai.controller";
import { AI_TYPES } from "../../types/ai/ai.types";

export const AiModule = new ContainerModule(({ bind }) => {
	// Services
	bind(AI_TYPES.IAiDataAggregator).to(AiDataAggregator);

	// UseCases
	bind(AI_TYPES.IAiChatUseCase).to(AiChatUseCase);

	// Controller
	bind(AI_TYPES.AiController).to(AiController);
});
