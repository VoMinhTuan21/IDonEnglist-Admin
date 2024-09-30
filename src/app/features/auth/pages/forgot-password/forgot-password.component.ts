import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { CreateNewPassComponent } from "./create-new-pass/create-new-pass.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    NzFlexModule,
    RouterOutlet,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    CreateNewPassComponent,
    VerifyEmailComponent
],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  currentStep: 'verifyEmail' | 'createNewPassword' = 'verifyEmail';
  goToNextStep() {
    this.currentStep = 'createNewPassword';
  }

  goToPreviousStep() {
    this.currentStep = 'verifyEmail';
  }
}
