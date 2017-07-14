import { TestTzPage } from './app.po';

describe('test-tz App', () => {
  let page: TestTzPage;

  beforeEach(() => {
    page = new TestTzPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
