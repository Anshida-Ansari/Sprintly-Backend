import { ContainerModule } from "inversify";
import { AiChatUseCase } from "../../../../application/usecases/ai/implementation/ai.chat.usecase";
import { AiController } from "../../../../presentation/http/controllers/ai.controller";
import { AI_TYPES } from "../../types/ai/ai.types";

export const AiModule = new ContainerModule(({ bind }) => {
	// UseCases
	bind(AI_TYPES.IAiChatUseCase).to(AiChatUseCase);

	// Controller
	bind(AI_TYPES.AiController).to(AiController);
});
