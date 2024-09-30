import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Observable, Subscription } from 'rxjs';
import { LoginForm, LoginResponse } from '../../models/login.model';
import AuthActions from '../../store/auth.action';
import { selectAuthLoading, selectUser } from '../../store/auth.selector';
import { AuthState } from '../../store/auth.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzFlexModule,
    NzCheckboxModule,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    NzIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy{
  passwordVisible = false;
  loading$!: Observable<boolean>;
  user$!: Observable<LoginResponse>;
  private subscription: Subscription = new Subscription();

  constructor(private fb: NonNullableFormBuilder, private store: Store<{auth: AuthState}>, private router: Router) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectAuthLoading);
    this.user$ = this.store.select(selectUser);

    this.subscription.add(
      this.user$.subscribe(user => {
        if (user.id && user.token) {
          this.router.navigate(["/"]);
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  form: FormGroup<{
    email: FormControl<string>,
    password: FormControl<string>,
    remember: FormControl<boolean>,
  }> = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  })

  onSubmit(): void {
    if (this.form.valid) {
      const body: LoginForm = {
        email: this.form.value.email ?? "",
        password: this.form.value.password ?? "",
        remember: this.form.value.remember
      }

      this.store.dispatch(AuthActions.login(body));
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
