import { TestBed } from '@angular/core/testing';

import { MultiIsLoadingService } from './multi-is-loading.service';
import { Observable, Subscriber } from 'rxjs';

describe('MultiIsLoadingService', () => {
  let service: MultiIsLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new MultiIsLoadingService();
  });

  /**
   * This test checks if the service is created.
   */
  it('should be created', () => {
    
    expect(service).toBeTruthy();
  });

  /**
   * This test checks if the service is not loading after init.
   */
  it('should not be loading when loading is empty', () => {
    
    expect(service.isLoading()).toBeFalse();
  });

  /**
   * This test checks if the service is loading after startLoading.
   */
  it('should be be loading with loading length of 1 after running startLoading', () => {
    
    expect(service.startLoading()).toBeTruthy();
    expect(service.isLoading()).toBeTrue();
    console.log('\n\n\nservice.loading');
    console.log(service.loading);
    expect(service.loading.length == 1).toBeTrue();
  });
  
  /**
   * This test checks if the service is not loading after stopLoading.
   */
  it('should not be loading after running stopLoading', () => {
    
    expect(service.isLoading()).toBeFalse();
    service.startLoading();
    expect(service.loading.length == 1).toBeTrue();
    service.stopLoading();
    expect(service.isLoading()).toBeFalse();
    expect(service.loading.length == 0).toBeTrue();
  });

  /**
   * This test checks if the service is loading after loadingUntilComplete.
   */
  it('should add a custom loading id and check for it', () => {
    
    expect(service.startLoading('CUSTOM_ID')).toBeTruthy();
    expect(service.isLoading('CUSTOM_ID')).toBeTrue();
    expect(service.isLoading()).toBeTrue();
  });

  /**
   * This test checks if the service is not loading after stopLoading with a custom loading id.
    */
  it('should remove a specified loading id', () => {
    
    expect(service.startLoading('CUSTOM_ID')).toBeTruthy();
    expect(service.isLoading('CUSTOM_ID')).toBeTrue();
    expect(service.isLoading()).toBeTrue();
    expect(service.stopLoading(['CUSTOM_ID'])).toBeTruthy();
    expect(service.isLoading()).toBeFalse();
  });

  /**
   * This test checks if isLoading is true while the observable is not complete, and is false after it finishes.
   */
  it('should be loading until the Observable completes', () => {
    
    let obsSubscriber: Subscriber<void> = new Subscriber<void>();
    const obs = service.loadingUntilComplete(new Observable<void>((observer)=>{
      obsSubscriber = observer;
      observer.next();
      // setTimeout(()=>observer.complete(), 1000);
    })).subscribe();
    expect(service.isLoading()).toBeTrue();
    if(obsSubscriber as unknown as Subscriber<void>){
      obsSubscriber.complete();
    }
    expect(service.isLoading()).toBeFalse();
  });

  /**
   * This test checks if the service is loading after loadingUntilComplete.
   */
  it('should set a custom loading id generator', () => {
    
    service.setLidGeneratorFn(()=>'CUSTOM_ID2');
    expect(service.startLoading()).toBeTruthy();
    expect(service.isLoading('CUSTOM_ID2')).toBeTrue();
    expect(service.isLoading()).toBeTrue();
    expect(service.stopLoading(['CUSTOM_ID2'])).toBeTruthy();
    expect(service.isLoading()).toBeFalse();
  });
});
