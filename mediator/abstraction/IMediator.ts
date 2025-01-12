import type IRequest from "../../cqrs/IRequest";

export default interface IMediator {
  register<TRequest extends IRequest<TResponse>, TResponse>(
    request: new (...args: any[]) => TRequest,
    handler: any,
  ): void;
  send<TRequest extends IRequest<TResponse>, TResponse>(request: TRequest): Promise<TResponse>;
}
