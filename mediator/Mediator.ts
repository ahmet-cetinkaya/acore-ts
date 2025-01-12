import type IRequest from "../cqrs/IRequest";
import type IRequestHandler from "../cqrs/IRequestHandler";
import type IMediator from "./abstraction/IMediator";

export default class Mediator implements IMediator {
  private handlers = new Map<new (...args: any[]) => IRequest<any>, IRequestHandler<any, any>>();

  register<TRequest extends IRequest<TResponse>, TResponse>(
    requestType: new (...args: any[]) => TRequest,
    handler: IRequestHandler<TRequest, TResponse>,
  ): void {
    this.handlers.set(requestType, handler);
  }

  async send<TRequest extends IRequest<TResponse>, TResponse>(request: TRequest): Promise<TResponse> {
    const handler = this.handlers.get(request.constructor as new (...args: any[]) => TRequest);
    if (!handler) throw new Error(`No handler registered for request ${request.constructor.name}`);

    return await handler.handle(request);
  }
}
