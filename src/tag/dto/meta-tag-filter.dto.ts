export class MetagTagFilterDto {
  readonly page: number;
  readonly pageSize: number;
  readonly quantity: number;

  constructor(page: number, pageSize: number, quantity: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.quantity = quantity;
  }
}
