import { createParamDecorator, ExecutionContext } from "@nestjs/common";


const getCurrentUserContext = (context: ExecutionContext): any => {
 return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => { getCurrentUserContext(context); },
)