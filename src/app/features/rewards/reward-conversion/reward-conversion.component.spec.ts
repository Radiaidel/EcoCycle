import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardConversionComponent } from './reward-conversion.component';

describe('RewardConversionComponent', () => {
  let component: RewardConversionComponent;
  let fixture: ComponentFixture<RewardConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardConversionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RewardConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
