import { ContainerModule } from "inversify";
import { AI_TYPES } from "../../types/ai/ai.types";
import { AiChatUseCase } from "../../../../application/usecases/ai/implementation/ai.chat.usecase";
import { AiController } from "../../../../presentation/http/controllers/ai.controller";

export const AiModule = new ContainerModule(({ bind }) => {
  // UseCases
  bind(AI_TYPES.IAiChatUseCase).to(AiChatUseCase);

  // Controller
  bind(AI_TYPES.AiController).to(AiController);
});
