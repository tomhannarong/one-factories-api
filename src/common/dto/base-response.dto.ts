export class BaseResponseDTO<T = any> {
  statusCode!: number;
  message!: string;
  data?: T;
  errorCode?: string;
}
