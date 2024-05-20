import { GENERIC_RESPONSE_STATUS } from '../enums/common';

export class ResponseModel<T> {
  statusCode: GENERIC_RESPONSE_STATUS;
  message: string;
  data: T;

  constructor(statusCode: GENERIC_RESPONSE_STATUS, message: string, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, data: T): ResponseModel<T> {
    return new ResponseModel<T>(GENERIC_RESPONSE_STATUS.SUCCESS, message, data);
  }

  static failed<T>(message: string, data: T): ResponseModel<T> {
    return new ResponseModel<T>(GENERIC_RESPONSE_STATUS.FAILED, message, data);
  }
}
