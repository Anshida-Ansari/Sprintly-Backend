export interface IExecure<T,S>{
 execute(dto:T):Promise<S>
}