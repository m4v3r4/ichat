import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateChatPage } from './create-chat.page';

describe('CreateChatPage', () => {
  let component: CreateChatPage;
  let fixture: ComponentFixture<CreateChatPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(CreateChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
