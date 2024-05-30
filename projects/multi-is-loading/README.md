# MultiIsLoading

This library provides a service, MultiIsLoadingService, which allows users to combine multiple loading states into one. For example, you may want to show a loading animation on a page until two seperate requests have finished loading data. There are other usecases, but they all revolve around a similar usecase - needing to wait for multiple things to finish loading.

## Usage
The best way to use the MultiIsLoadingService is to use it in a component's provider like the following.

```typescript
import { Component } from '@angular/core';
import { MultiIsLoadingService } from 'multi-is-loading';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:  [MultiIsLoadingService] // This is now it's own instance
})
export class AppComponent {
  constructor(private multiIsLoading: MultiIsLoadingService) {}

    ngOnInit(){
        this.multiIsLoading.isLoading(); // false
        const lid = this.multiIsLoading.startLoading(); // adds a randome loading id, lid to the loading state
        this.multiIsLoading.isLoading(); // true
        this.multiIsLoading.isLoading(lid); // true because this loading id is in the loading state
        this.multiIsLoading.stopLoading(lid); // removes the lid from the loading state. If no param is given, it removes all of them
        this.multiIsLoading.isLoading(); // false

        const obs = new Observable(subscriber => {
            setTimeout(() => {
                subscriber.complete();
            }, 3000);
        });
        // Automatically subscribes to and returns the observable as a ShareReplay pipe. Sets the loading state to true with it's own id until the observable completes.
        this.multiIsLoading.loadingUntilComplete(obs); 
        this.multiIsLoading.isLoading(); // true
        setTimeout(() => {
            this.multiIsLoading.isLoading(); // false, because the observable finishes after 3s, and the lid is removed from the loading state.
        }, 3500);

        // You can even set your own loading id generator
        this.multiIsLoading.setLidGeneratorFn(()=>{return 'Your custom id generator here';})
    }

    // The rest of your code...
}
```

Using it this way, each time you use the MultiIsLoadingService service will be it's own instance.

## Note

This was made for angular 11 because I have a specific angular 11 project I am working on that would benefit from this, but I am planning one moving it to Angular 17 soon.