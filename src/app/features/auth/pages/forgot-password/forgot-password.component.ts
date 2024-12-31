import { NgSwitch, NgSwitchCase } from '@angular/common';
import { Component } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { CreateNewPassComponent } from "./create-new-pass/create-new-pass.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        NzFlexModule,
        NgSwitch,
        NgSwitchCase,
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
