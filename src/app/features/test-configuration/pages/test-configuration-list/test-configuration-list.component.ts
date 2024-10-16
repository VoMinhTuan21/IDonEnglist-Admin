import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkillPipe } from '@core/pipes/skill.pipe';
import { UrlCodePipe } from '@core/pipes/url.pipe';
import { ITestTypeTableItem } from '@features/test-configuration/models/test-configuration';
import { TestConfigurationActions } from '@features/test-configuration/store/test-configuration.action';
import { TestConfigurationSelect } from '@features/test-configuration/store/test-configuration.selector';
import { Store } from '@ngrx/store';
import { BoxComponent } from '@shared/components/box/box.component';
import { PaginatedList } from '@shared/models/common';
import { Skill } from '@shared/models/enum';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-configuration-list',
  standalone: true,
  imports: [
    BoxComponent,
    NzTableModule,
    NzTagModule,
    NzFlexModule,
    NzIconModule,
    SkillPipe,
    RouterLink,
    UrlCodePipe,
    NzTypographyModule,
    NzButtonModule,
    AsyncPipe,
  ],
  templateUrl: './test-configuration-list.component.html',
  styleUrl: './test-configuration-list.component.scss',
})
export class TestConfigurationListComponent implements OnInit, OnDestroy {
  testConfigurations: ITestTypeTableItem[] = [
    {
      id: 1,
      categorySkill: {
        id: 1,
        skill: Skill.Listening,
        category: {
          id: 1,
          code: 'toeic-reading-listening',
          name: 'Toeic Reading & Listening',
        },
      },
      durations: 100,
      name: 'Toeic Reading Test',
      code: 'toeic-reading-test',
      parts: 4,
      questions: 100,
    },
  ];

  table!: PaginatedList<ITestTypeTableItem>;
  loading$!: Observable<boolean>;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(TestConfigurationSelect.table)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value.items.length === 0) {
          this.store.dispatch(TestConfigurationActions.getPagination({pageSize: 10, pageNumber: 1}))
        }
        this.table = value;
      });

    this.loading$ = this.store
        .select(TestConfigurationSelect.loading)
        .pipe(takeUntil(this.unsubscribe$));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
