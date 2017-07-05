import { MapProPage } from './app.po';

describe('map-pro App', () => {
  let page: MapProPage;

  beforeEach(() => {
    page = new MapProPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
