export class MetagTagFilterDto {
  readonly page: number;
  readonly pageSize: number;
  readonly quantity: number;

  constructor(page: number, pageSize: number, quantity: number | null) {
    this.page = page;
    this.pageSize = pageSize;
    if (quantity) {
      this.quantity = quantity;
    }
  }
}
