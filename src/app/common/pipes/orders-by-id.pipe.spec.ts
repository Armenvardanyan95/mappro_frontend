import { OrdersByIDPipe } from './orders-by-id.pipe';

describe('OrdersByIDPipe', () => {
  it('create an instance', () => {
    const pipe = new OrdersByIDPipe();
    expect(pipe).toBeTruthy();
  });
});
