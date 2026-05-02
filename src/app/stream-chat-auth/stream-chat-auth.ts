import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth/auth-service';
import { RouterService } from '@app/services/router-service';

@Component({
  selector: 'sc-stream-chat-auth',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './stream-chat-auth.html',
  styleUrl: './stream-chat-auth.scss',
})
export class StreamChatAuth {
  private routerService = inject(RouterService);  
  private authService = inject(AuthService);

  private route = inject(ActivatedRoute);

  isLoginMode = this.route.snapshot.data['mode'] === 'login';

  authForm = new FormGroup({ 
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.authForm.valid) {
      const { username, password } = this.authForm.value;

      const req = this.isLoginMode ? this.authService.login(username!, password!) : this.authService.register(username!, password!);
      req.subscribe({
        next: () => {
          this.routerService.navigate(['/stream', 'chat']);
        },
        error: (error) => {
          console.error('Authentication error:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
