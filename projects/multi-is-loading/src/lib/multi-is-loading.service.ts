import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';

@Injectable()
export class MultiIsLoadingService {

  /** 
   * An array of loading ids, lids
  */
  loading: string[] = [];
  /**
   * A subject that emits the current loading state whenever it changes
   */
  loadingStateChange = new Subject<string[]>();

  /**
   * A function that generates a loading id, lid.
   * This can be customized with the setLidGeneratorFn method.
   */
  private lidGeneratorFn = ()=>Math.random().toString(36).substring(7);

  constructor() { }

  /**
   * Set the function that generates loading ids, lids.
   * This is useful for testing, or if you want to use a custom id generator.
   * @param newGeneratorFn A function that returns a string that will be used as a loading id, lid.
   */
  setLidGeneratorFn(newGeneratorFn: ()=>string){
    this.lidGeneratorFn = newGeneratorFn;
  }

  /**
   * Check if the service is currently loading.
   * If no param is provided, checks if any loading is happening.
   * If a loading id is provided, checks if that specific loading id is currently loading.
   * @param lid A loading id, lid. If provided, checks if that specific loading id is currently loading.
   */
  isLoading(lid?: string){
    if(lid !== undefined){
      return this.loading.indexOf(lid) > -1;
    }
    return this.loading.length > 0;
  }

  /**
   * A function that wraps an observable and adds a new loading id to the loading array.
   * Stops loading when the observable completes.
   * @param observable The observable to wrap.
   * @param lid A loading id, lid. If provided, uses that loading id. If not provided, generates a new loading id.
   */
  loadingUntilComplete<ObservableReturnType>(observable: Observable<ObservableReturnType>, lid?: string){
    const lidToUse = this.startLoading(lid);
    const sobs = observable.pipe(
      shareReplay(), // Share this thing, we don't want to re-run it every time someone subscribes
      finalize(()=>this.stopLoading([lidToUse])) // On complete, stopLoading
    );
    sobs.subscribe(()=>{}); // Make sure it runs at least once by to subbing to it
    return sobs;
  }

  /**
   * A function that adds a new loading id to the loading array and returns it for tracking.
   * @param userProvidedLid A loading id, lid. If provided, uses that loading id. If not provided, generates a new loading id.
   */
  startLoading(userProvidedLid?: string){
    const lid = userProvidedLid!==undefined?
      userProvidedLid
      : this.lidGeneratorFn();
    if(this.loading.includes(lid)){
      return lid;
    }
    this.loading.push(lid);
    this.loadingStateChange.next(this.loading);
    return lid;
  }

  /**
   * A function that removes a loading id from the loading array.
   * If no loading id is provided, removes all loading ids.
   * @param lids An array of loading ids, lids. If provided, removes those loading ids. In not provided, removes all loading ids.
   */
  stopLoading(lids?: string[]){ // If no arg, stop all loading
    let removedLids: string[] = [];
    if(lids != undefined){
      for(let i = 0; i < lids.length; i++){
        const lid = lids[i];
        const lidIndex = this.loading.indexOf(lid);
        if(lidIndex > -1){
          this.loading.splice(lidIndex, 1);
          removedLids.push(lid);
        }
      }
      if(removedLids.length > 0){
        this.loadingStateChange.next(this.loading);
      }
    }else{
      removedLids = [...this.loading];
      this.loading = [];
      this.loadingStateChange.next(this.loading);
    }
    return removedLids;
  }

}
