import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren, DestroyRef, inject, Input,
  OnInit,
  QueryList
} from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import {StepComponent} from './step/step.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements OnInit, AfterContentChecked {
  @Input() interval? : number
  @Input({transform: () => true}) random : boolean = false
  @Input({transform: () => true}) no_controls : boolean = false

  private readonly destroyRef = inject(DestroyRef)

  currentIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0)

  @ContentChildren(StepComponent)
  steps!: QueryList<StepComponent>

  get isFirst() {
    return this.currentIndex.value == 0
  }

  get last() {
    return this.steps.length - 1
  }

  get isLast() {
    return this.currentIndex.value === this.last
  }

  ngAfterContentChecked(): void {
    this.steps.forEach((step, index) => {
      step.index = index
      // Utile uniquement en DEV
      step.changeRef.detectChanges()
    })
  }

  set(index: number) {
    if(index < 0) index = 0
    const last = this.steps.length - 1
    if(index > last) index = last
    this.currentIndex.next(index)
  }

  prev() {
    this.currentIndex.next(this.isFirst ? this.last : this.currentIndex.value - 1)
  }

  next() {
    this.currentIndex.next(this.isLast ? 0 : this.currentIndex.value + 1)
  }

  ngOnInit(): void {
    if (this.interval)
      interval(this.interval).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if(this.random) this.currentIndex.next(Math.ceil(Math.random() * (this.steps?.length || 0)))
        else this.next()
      })
  }

}
