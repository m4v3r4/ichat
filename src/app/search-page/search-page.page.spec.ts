import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPagePage } from './search-page.page';

describe('SearchPagePage', () => {
  let component: SearchPagePage;
  let fixture: ComponentFixture<SearchPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
