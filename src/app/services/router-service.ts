import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router); // Replace with actual Router injection if using Angular's Router

  navigate(path: string[]): void {
    this.router.navigate(path);
  }
  
}
